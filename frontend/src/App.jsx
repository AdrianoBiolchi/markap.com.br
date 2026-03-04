import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Sidebar from './components/ui/Sidebar';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Onboarding from './pages/Onboarding';
import Analysis from './pages/Analysis';
import Upgrade from './pages/Upgrade';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import BusinessProfile from './pages/BusinessProfile';
import { cn } from './lib/utils';

export default function App() {
  const { isAuth, hasCompletedOnboarding } = useAuthStore();
  const location = useLocation();

  // Navigation Logic
  const publicPaths = ['/login', '/register', '/'];
  const isPublicPath = publicPaths.includes(location.pathname);

  if (!isAuth && !isPublicPath) {
    return <Navigate to="/login" replace />;
  }

  if (isAuth && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isAuth && !hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Sidebar visibility
  const hideSidebarPaths = ['/onboarding', '/login', '/register', '/'];
  const showSidebar = isAuth && hasCompletedOnboarding && !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-green-primary/10">
      {showSidebar && <Sidebar />}
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        showSidebar ? 'pl-64' : ''
      )}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/calculator/:id" element={<Calculator />} />
          <Route path="/analysis/:id" element={<Analysis />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/business-profile" element={<BusinessProfile />} />

          <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/"} replace />} />
        </Routes>
      </main>
    </div>
  );
}
