import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Lightbulb } from 'lucide-react';
import { getClientPersistence, setClientPersistence } from '../../utils/clientPersistence';

export default function OnboardingTips() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = getClientPersistence('onboarding-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setClientPersistence('onboarding-dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-2 border-primary/50 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Quick Tips
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDismiss}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Use the Logo Maker to create custom logos</p>
          <p>• Click elements on the canvas to select them</p>
          <p>• Drag elements to reposition them</p>
          <p>• Use the layers panel to reorder elements</p>
          <p>• Save your work regularly</p>
          <p>• Export as PNG when you're done!</p>
        </CardContent>
      </Card>
    </div>
  );
}
