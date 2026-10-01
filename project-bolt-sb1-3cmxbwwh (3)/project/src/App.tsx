import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Storefront from '@/components/Storefront';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

type Route = 'store' | 'admin';

function getRouteFromPath(): Route {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/admin') return 'admin';
  return 'store';
}

function AppContent() {
  const { user, loading, isAdmin } = useAuth();
  const [route, setRoute] = useState<Route>(getRouteFromPath);

  useEffect(() => {
    const onPop = () => setRoute(getRouteFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (r: Route) => {
    const path = r === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setRoute(r);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
      </div>
    );
  }

  if (route === 'admin') {
    if (user && isAdmin) {
      return <Dashboard onGoStore={() => navigate('store')} />;
    }
    return <Login onBack={() => navigate('store')} />;
  }

  return <Storefront />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
