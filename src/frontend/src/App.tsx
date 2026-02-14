import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import DesignerPage from './pages/DesignerPage';
import LogoMakerPage from './pages/LogoMakerPage';
import ProjectGalleryPage from './pages/ProjectGalleryPage';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const designerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/designer',
  component: DesignerPage,
});

const logoMakerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/logo-maker',
  component: LogoMakerPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: ProjectGalleryPage,
});

const routeTree = rootRoute.addChildren([indexRoute, designerRoute, logoMakerRoute, projectsRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
