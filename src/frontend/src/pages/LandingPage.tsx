import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Shirt, Layers, Download } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Design Your Dream Apparel
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create custom clothing designs with your own logos. Professional tools, unlimited creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate({ to: '/designer' })} className="text-lg px-8">
              <Shirt className="w-5 h-5 mr-2" />
              Start Designing
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/logo-maker' })}
              className="text-lg px-8"
            >
              <Palette className="w-5 h-5 mr-2" />
              Create Logo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shirt className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Garments</h3>
                <p className="text-muted-foreground">Choose from T-shirts, hoodies, and caps to design.</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Logo Maker</h3>
                <p className="text-muted-foreground">Create custom logos with text and shapes or upload your own.</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Layer Control</h3>
                <p className="text-muted-foreground">Manage, reorder, and edit design elements with ease.</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Export & Save</h3>
                <p className="text-muted-foreground">Download high-res PNGs and save projects to the cloud.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Sign in to save your designs and access them from anywhere.
          </p>
          <Button size="lg" onClick={() => navigate({ to: '/projects' })} className="text-lg px-8">
            View My Projects
          </Button>
        </div>
      </section>
    </div>
  );
}
