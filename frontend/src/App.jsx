import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/shared/LoginPage';
import RegisterPage from './pages/shared/RegisterPage';
import LandingPage from './pages/shared/LandingPage';
import NotFound from './pages/shared/NotFound';

// UMKM
import UMKMLayout from './components/layout/UMKMLayout';
import UMKMDashboard from './pages/umkm/UMKMDashboard';
import MyProducts from './pages/umkm/MyProducts';
import AddProduct from './pages/umkm/AddProduct';
import MyRequests from './pages/umkm/MyRequests';
import UMKMRecommendations from './pages/umkm/UMKMRecommendations';

// Exporter
import ExporterLayout from './components/layout/ExporterLayout';
import ExporterDashboard from './pages/exporter/ExporterDashboard';
import ProductCatalog from './pages/exporter/ProductCatalog';
import ProductDetail from './pages/exporter/ProductDetail';
import CountryData from './pages/exporter/CountryData';

// Admin
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminStats from './pages/admin/AdminStats';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* UMKM Routes */}
          <Route path="/umkm" element={<PrivateRoute roles={['umkm']}><UMKMLayout /></PrivateRoute>}>
            <Route index element={<UMKMDashboard />} />
            <Route path="products" element={<MyProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<AddProduct />} />
            <Route path="requests" element={<MyRequests />} />
            <Route path="recommendations" element={<UMKMRecommendations />} />
          </Route>

          {/* Exporter Routes */}
          <Route path="/exporter" element={<PrivateRoute roles={['exporter']}><ExporterLayout /></PrivateRoute>}>
            <Route index element={<ExporterDashboard />} />
            <Route path="catalog" element={<ProductCatalog />} />
            <Route path="catalog/:id" element={<ProductDetail />} />
            <Route path="countries" element={<CountryData />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminLayout /></PrivateRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="stats" element={<AdminStats />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
