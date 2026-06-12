# 🌿 Authentic Aceh Export — Sistem Rekomendasi Pasar Ekspor

**Kelompok 10** | Proyek Perangkat Lunak Berbasis Komponen  
Tasya Zahrani · Aska Shahira · Tasya Maulida  
Universitas Syiah Kuala — Program Studi Informatika

---

## 📖 Deskripsi

Platform web berbasis **microservice** yang membantu UMKM Aceh menemukan peluang ekspor melalui analisis tren marketplace global (Etsy API). Sistem mencocokkan produk unggulan Aceh (Kopi Gayo, Madu Hutan, Kerajinan, Fesyen Muslim, Rempah) dengan permintaan pasar internasional.

---

## 🏗️ Arsitektur Microservice

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                     Port: 3000                                   │
└─────────────────────────┬───────────────────────────────────────┘
                           │ HTTP
┌─────────────────────────▼───────────────────────────────────────┐
│                      API GATEWAY                                 │
│                     Port: 5000                                   │
│         (Auth Middleware, Rate Limiting, Routing)                │
└────┬─────────────┬──────────────┬──────────────┬───────────────┘
     │             │              │              │
     ▼             ▼              ▼              ▼
┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐
│  Auth   │ │ Product  │ │  Trend   │ │ Recommendation │
│ Service │ │ Service  │ │ Service  │ │   Service      │
│ :3001   │ │  :3002   │ │  :3003   │ │    :3004       │
└────┬────┘ └────┬─────┘ └────┬─────┘ └───────┬────────┘
     │           │             │               │
     └───────────┴─────────────┴───────────────┘
                          │
                   ┌──────▼──────┐
                   │   MongoDB   │
                   │  Database   │
                   └─────────────┘
```

### Services

| Service | Port | Fungsi |
|---------|------|--------|
| **API Gateway** | 5000 | Routing, Auth Middleware, Rate Limiting |
| **Auth Service** | 3001 | Login, Register, User Management |
| **Product Service** | 3002 | CRUD Produk, Export Interests |
| **Trend Service** | 3003 | Etsy API / Mock Trends, Data Mining |
| **Recommendation Service** | 3004 | Algoritma Rekomendasi Pasar |
| **Frontend** | 3000 | React UI |

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js v18+
- MongoDB (lokal atau Atlas)
- npm v9+

### 1. Instalasi

```bash
# Clone / ekstrak project
cd aceh-export-system

# Install semua dependencies sekaligus
npm run install:all
```

### 2. Konfigurasi Environment

Edit file `.env` di root:

```env
MONGODB_URI=mongodb://localhost:27017/aceh_export_db
JWT_SECRET=aceh_export_secret_key_2024
ETSY_API_KEY=your_etsy_api_key_here:shared_secret  #opsional pakai mock jika kosong
```
> **Tanpa Etsy API key** pun bisa jalan — sistem otomatis pakai data mock realistis.

### 3. Seed Database (akun & produk demo)

```bash
# Install dependencies seed dulu (sekali saja)
npm install mongoose bcryptjs dotenv

# Jalankan seed
node seed.js
```

### 4. Jalankan Semua Service

```bash
# Jalankan semua service sekaligus (perlu concurrently)
npm install
npm run dev
```

Atau jalankan satu per satu di terminal berbeda:

```bash
# Terminal 1 — Auth Service
cd services/auth-service && npm install && npm start

# Terminal 2 — Product Service  
cd services/product-service && npm install && npm start

# Terminal 3 — Trend Service
cd services/trend-service && npm install && npm start

# Terminal 4 — Recommendation Service
cd services/recommendation-service && npm install && npm start

# Terminal 5 — API Gateway
cd api-gateway && npm install && npm start

# Terminal 6 — Frontend
cd frontend && npm install && npm start
```

### 5. Akses Aplikasi

Buka browser: **http://localhost:3000**

---

## 👥 Akun Demo

| Role | Email | Password |
|------|-------|----------|
| 🔑 Admin | admin@aceh.id | admin123 |
| 🏪 UMKM (Kopi) | umkm@aceh.id | umkm123 |
| 🏪 UMKM (Madu) | umkm2@aceh.id | umkm123 |
| 🌍 Eksportir | eksportir@aceh.id | eksportir123 |

---

## 📁 Struktur Proyek

```
aceh-export-system/
├── .env                          # Environment variables
├── package.json                  # Root — concurrently runner
├── seed.js                       # Database seeder
│
├── api-gateway/                  # 🚪 API Gateway (Port 5000)
│   └── server.js
│
├── services/
│   ├── auth-service/             # 🔐 Autentikasi (Port 3001)
│   │   ├── models/User.js
│   │   ├── routes/auth.js
│   │   ├── routes/admin.js
│   │   └── middleware/auth.js
│   │
│   ├── product-service/          # 📦 Produk & Minat (Port 3002)
│   │   ├── models/Product.js
│   │   ├── models/ExportInterest.js
│   │   ├── routes/products.js
│   │   ├── routes/exportInterests.js
│   │   └── routes/adminProducts.js
│   │
│   ├── trend-service/            # 📈 Tren Global (Port 3003)
│   │   ├── models/TrendData.js
│   │   ├── routes/trends.js
│   │   └── services/etsyService.js   ← Etsy API + mock fallback
│   │
│   └── recommendation-service/   # 🎯 Rekomendasi (Port 3004)
│       └── routes/recommendations.js
│
└── frontend/                     # ⚛️ React App (Port 3000)
    └── src/
        ├── App.jsx
        ├── context/AuthContext.jsx
        ├── services/api.js
        ├── components/
        │   ├── layout/           # Sidebar, Layout per role
        │   └── ui/TrendChart.jsx
        └── pages/
            ├── shared/           # Landing, Login, Register
            ├── umkm/             # Dashboard, Products, Requests, Recommendations
            ├── exporter/         # Dashboard, Catalog, ProductDetail, Countries
            └── admin/            # Dashboard, Users, Products, Stats
```

---

## 🔑 API Endpoints

### Auth Service (via Gateway)
| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/api/auth/register` | Registrasi |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Profil user (auth) |
| PUT | `/api/auth/profile` | Update profil (auth) |

### Product Service (via Gateway)
| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/products` | Semua produk (public) |
| GET | `/api/products/:id` | Detail produk |
| GET | `/api/products/my/products` | Produk milik UMKM (auth) |
| POST | `/api/products` | Buat produk (UMKM) |
| PUT | `/api/products/:id` | Edit produk (UMKM) |
| DELETE | `/api/products/:id` | Hapus produk (UMKM) |
| POST | `/api/export-interests` | Ajukan minat ekspor |
| GET | `/api/export-interests/my-requests` | Permintaan masuk (UMKM) |

### Trend Service (via Gateway)
| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/trends/public/top` | Top tren (public) |
| GET | `/api/trends/public/by-category` | Tren per kategori |
| GET | `/api/trends/public/countries` | Negara potensial |
| POST | `/api/trends/refresh` | Refresh dari Etsy API |

### Recommendation Service (via Gateway)
| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/recommendations/public/by-category/:category` | Rekomendasi per kategori |
| GET | `/api/recommendations/public/overview` | Overview semua kategori |
| POST | `/api/recommendations/for-product` | Rekomendasi untuk produk |

---
## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS, Recharts |
| API Gateway | Express.js, http-proxy-middleware, JWT |
| Auth Service | Express.js, Mongoose, bcryptjs, JWT |
| Product Service | Express.js, Mongoose |
| Trend Service | Express.js, Mongoose, Axios, node-cron, **Etsy API** |
| Recommendation | Express.js, algoritma scoring berbasis tren |
| Database | MongoDB |
---

## 🌟 Fitur Utama

### Untuk UMKM
- ✅ Input & kelola produk dengan kategori & kontak
- ✅ Lihat rekomendasi negara tujuan ekspor berbasis tren global
- ✅ Strategi pemasaran per kategori produk
- ✅ Terima & kelola permintaan dari eksportir

### Untuk Eksportir
- ✅ Browse katalog produk UMKM Aceh
- ✅ Ajukan minat ekspor dengan form
- ✅ Kontak langsung UMKM via WhatsApp / telepon / email
- ✅ Data negara & kategori produk potensial

### Untuk Admin (Dinas Perdagangan)
- ✅ Monitoring semua UMKM & eksportir
- ✅ Statistik produk, permintaan, negara tujuan
- ✅ Grafik distribusi & tren global
- ✅ Refresh data tren dari Etsy API

---

## 📊 Contoh Output Sistem

```
Kopi Gayo        → Jepang (Skor: 94)   → Tren: Sangat Tinggi
Madu Hutan       → Malaysia (Skor: 87) → Tren: Tinggi  
Fesyen Muslim    → Turki (Skor: 89)    → Tren: Sangat Tinggi
Kerajinan Rotan  → Australia (Skor: 81) → Tren: Tinggi

Strategi: Gunakan kemasan premium & promosi coffee culture
```

---

*© 2026 Kelompok 10 — Sistem Rekomendasi Pasar Ekspor Produk Kerajinan Aceh*
