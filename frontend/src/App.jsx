import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Onboarding from './pages/Onboarding';
import Analysis from './pages/Analysis';
import Upgrade from './pages/Upgrade';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import BusinessProfile from './pages/BusinessProfile';
import ForgotPassword from './pages/ForgotPassword';

export default function App() {
  const { isAuth, hasCompletedOnboarding } = useAuthStore();
  const location = useLocation();

  // Navigation Logic
  const publicPaths = ['/login', '/register', '/', '/forgot-password'];
  const isPublicPath = publicPaths.includes(location.pathname);

  // Auth Guard
  if (!isAuth && !isPublicPath) {
    return <Navigate to="/login" replace />;
  }

  // Auto-redirect if trying to visit login/register while authenticated
  if (isAuth && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Onboarding Guard - Only redirect if NOT already going to onboarding or business-profile
  // Assuming business-profile is also part of the setup flow
  if (isAuth && !hasCompletedOnboarding &&
    location.pathname !== '/onboarding' &&
    location.pathname !== '/business-profile') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <Routes>
      {/* ── Rotas STANDALONE (sem sidebar, sem Layout) ── */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Rotas Autenticadas mas Standalone (ex: configuração e setup) */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/business-profile" element={<BusinessProfile />} />

      {/* ── Rotas COM Layout (sidebar inclusa) ── */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/calculator/:id" element={<Calculator />} />
        <Route path="/analysis/:id" element={<Analysis />} />
        <Route path="/upgrade" element={<Upgrade />} />
      </Route>

      {/* Rota Padrão / 404 */}
      <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}