const axios = require('axios');
const TrendData = require('../models/TrendData');

const MOCK_TRENDS = [
  {
    keyword: 'Songket Aceh',
    category: 'kerajinan',
    trendScore: 82,
    searchVolume: 8500,
    topCountries: [
      { country: 'Malaysia', percentage: 35 },
      { country: 'Brunei', percentage: 25 }
    ],
    priceRange: {
      min: 25,
      max: 120
    }
  },
  {
    keyword: 'Aceh Patchouli Oil',
    category: 'rempah',
    trendScore: 80,
    searchVolume: 9200,
    topCountries: [
      { country: 'Perancis', percentage: 30 },
      { country: 'Amerika Serikat', percentage: 25 }
    ],
    priceRange: {
      min: 20,
      max: 75
    }
  }
];

async function fetchAndSaveTrends() {
  const apiKey =
    process.env.ETSY_API_KEY;

  console.log(
    '========================'
  );
  console.log(
    'ETSY API KEY:',
    apiKey ? apiKey : 'NOT FOUND'
  );
  console.log(
    '========================'
  );

  try {
    if (apiKey) {
      const etsyData =
        await fetchFromEtsy(apiKey);

      if (etsyData.length > 0) {
        console.log(
          `✅ Menggunakan data Etsy (${etsyData.length})`
        );

        await saveMissingMockCategories(
          etsyData
        );

        return etsyData;
      }
    }
  } catch (err) {
    console.log(
      '⚠️ Etsy API gagal:',
      err.message
    );
  }

  console.log(
    '⚠️ Fallback ke mock data'
  );

  return saveMockTrends();
}

async function fetchFromEtsy(apiKey) {
  const keywords = [
    // kopi
    'gayo coffee',
    'aceh coffee',
    'sumatra coffee',
    'arabica coffee',
    'specialty coffee',

    // madu
    'tualang honey',
    'wild honey',
    'raw honey',

    // kerajinan
    'rattan basket',
    'woven basket',
    'handmade basket',

    // fashion
    'muslim fashion',
    'modest fashion',
    'hijab',

    // rempah
    'black pepper',
    'organic pepper',
    'spice mix'
  ];

  const results = [];

  console.log(
    '🚀 Mencoba ambil data dari Etsy...'
  );

  for (const keyword of keywords) {
    try {
      console.log(
        `🔍 Keyword: ${keyword}`
      );

      const url =
        `https://openapi.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(
          keyword
        )}&limit=5&sort_on=score`;

      const response =
        await axios.get(url, {
          headers: {
            'x-api-key': apiKey
          },
          timeout: 10000
        });

      const listings =
        response.data.results || [];

      console.log(
        `📋 Listings: ${listings.length}`
      );

      if (!listings.length) {
        continue;
      }

      const prices = listings
        .map(item => {
          if (!item.price)
            return 0;

          if (
            typeof item.price ===
            'string'
          ) {
            return parseFloat(
              item.price
            );
          }

          return (
            item.price.amount /
            item.price.divisor
          );
        })
        .filter(v => v > 0);

      const first =
        listings[0];

      const trendDoc = {
        keyword,
        title:
          first.title || keyword,

        category:
          mapKeywordToCategory(
            keyword
          ),

        trendScore:
          Math.min(
            100,
            Math.round(
              50 +
                listings.length *
                  2
            )
          ),

        searchVolume:
          listings.length *
          1000,

        listingCount:
          listings.length,

        source: 'etsy',

        currency:
          first.price
            ?.currency_code ||
          'USD',

        topCountries: [
          {
            country:
              'Amerika Serikat',
            percentage: 35
          },
          {
            country: 'Jerman',
            percentage: 20
          },
          {
            country: 'Jepang',
            percentage: 15
          }
        ],

        priceRange:
          prices.length > 0
            ? {
                min: Math.round(
                  Math.min(
                    ...prices
                  )
                ),
                max: Math.round(
                  Math.max(
                    ...prices
                  )
                )
              }
            : {
                min: 10,
                max: 50
              },

        fetchedAt:
          new Date()
      };

      await TrendData.findOneAndUpdate(
        {
          keyword
        },
        trendDoc,
        {
          upsert: true,
          new: true
        }
      );

      results.push(
        trendDoc
      );

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            1000
          )
      );
    } catch (err) {
      console.log(
        `⚠️ ${keyword}: ${err.message}`
      );
    }
  }

  console.log(
    `📦 Total data Etsy: ${results.length}`
  );

  return results;
}

async function saveMissingMockCategories(
  etsyData
) {
  const existingCategories =
    new Set(
      etsyData.map(
        item =>
          item.category
      )
    );

  const missing =
    MOCK_TRENDS.filter(
      item =>
        !existingCategories.has(
          item.category
        )
    );

  for (const trend of missing) {
    await TrendData.findOneAndUpdate(
      {
        keyword:
          trend.keyword
      },
      {
        ...trend,
        source: 'mock',
        fetchedAt:
          new Date()
      },
      {
        upsert: true,
        new: true
      }
    );
  }

  console.log(
    `📦 Mock pelengkap: ${missing.length}`
  );
}

async function saveMockTrends() {
  for (const trend of MOCK_TRENDS) {
    await TrendData.findOneAndUpdate(
      {
        keyword:
          trend.keyword
      },
      {
        ...trend,
        source: 'mock',
        fetchedAt:
          new Date()
      },
      {
        upsert: true,
        new: true
      }
    );
  }

  return MOCK_TRENDS;
}

function mapKeywordToCategory(
  keyword
) {
  const k =
    keyword.toLowerCase();

  if (
    k.includes(
      'coffee'
    ) ||
    k.includes('kopi')
  ) {
    return 'kopi';
  }

  if (
    k.includes(
      'honey'
    ) ||
    k.includes('madu')
  ) {
    return 'madu';
  }

  if (
    k.includes(
      'basket'
    ) ||
    k.includes(
      'rattan'
    ) ||
    k.includes(
      'songket'
    )
  ) {
    return 'kerajinan';
  }

  if (
    k.includes(
      'fashion'
    ) ||
    k.includes(
      'hijab'
    ) ||
    k.includes(
      'muslim'
    )
  ) {
    return 'fesyen_muslim';
  }

  if (
    k.includes(
      'pepper'
    ) ||
    k.includes(
      'spice'
    ) ||
    k.includes(
      'rempah'
    )
  ) {
    return 'rempah';
  }

  return 'lainnya';
}

module.exports = {
  fetchAndSaveTrends
};