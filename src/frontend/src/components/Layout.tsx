import { Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Zap, Shield } from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';

export default function Layout() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleAdminClick = () => {
    navigate({ to: '/admin' });
  };

  const handleHomeClick = () => {
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <button onClick={handleHomeClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/assets/generated/flashtrend-logo.dim_256x256.png" alt="FlashTrend" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-foreground">FlashTrend</span>
              <span className="text-xs font-medium text-muted-foreground -mt-1">Lightning Fast News</span>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {isAuthenticated && isAdmin && (
              <Button onClick={handleAdminClick} variant="outline" size="sm" className="gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
            <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'} size="sm">
              {buttonText}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-32 overflow-hidden border-b border-border/40">
        <img
          src="/assets/generated/hero-background.dim_1920x400.png"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40" />
        <div className="relative container h-full flex items-center">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-flash-primary" />
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">Breaking News, Instantly</h1>
              <p className="text-sm text-muted-foreground font-medium">Stay ahead with viral updates & trending stories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} FlashTrend</span>
              <span>•</span>
              <span>Built with ❤️ using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiX className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
