import { Outlet, useNavigate } from '@tanstack/react-router';
import { Palette, Shirt } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';
import { Button } from '@/components/ui/button';

export default function AppLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shirt className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>DesignWear</span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" onClick={() => navigate({ to: '/designer' })}>
              Designer
            </Button>
            <Button variant="ghost" onClick={() => navigate({ to: '/logo-maker' })}>
              <Palette className="w-4 h-4 mr-2" />
              Logo Maker
            </Button>
            <Button variant="ghost" onClick={() => navigate({ to: '/projects' })}>
              My Projects
            </Button>
          </nav>

          <div className="flex items-center gap-3">
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card/30 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} DesignWear. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'designwear-app'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <ProfileSetupDialog />
    </div>
  );
}
