import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Dashboard from './pages/Dashboard';
import PriceEngineering from './pages/PriceEngineering';
import Onboarding from './pages/Onboarding';
import Analysis from './pages/Analysis';
import Upgrade from './pages/Upgrade';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import BusinessProfile from './pages/BusinessProfile';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';

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
  if (isAuth && !hasCompletedOnboarding &&
    location.pathname !== '/onboarding' &&
    location.pathname !== '/business-profile') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <Routes>
      {/* ── PÚBLICAS — split screen, sem shell ── */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ── SETUP — sem shell (são primeiros passos, fluxo limpo) ── */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/business-profile" element={<BusinessProfile />} />

      {/* ── APP — todas com AppShell (envolvido dentro das próprias telas) ── */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/precificar" element={<PriceEngineering />} />
      <Route path="/precificar/:id" element={<PriceEngineering />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/analysis/:id" element={<Analysis />} />
      <Route path="/upgrade" element={<Upgrade />} />
      <Route path="/settings" element={<Settings />} />

      <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}