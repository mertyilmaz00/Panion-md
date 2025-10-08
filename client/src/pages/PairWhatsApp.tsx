import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setAnalytics } from "@/lib/analytics";

export default function PairWhatsApp() {
  const [, setLocation] = useLocation();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [analyticsId, setAnalyticsId] = useState<string | null>(null);
  const { toast } = useToast();

  const sessionId = localStorage.getItem('sessionId');
  const couponCode = localStorage.getItem('couponCode');

  useEffect(() => {
    if (!sessionId || !couponCode) {
      setLocation('/coupon');
      return;
    }

    const initializeConnection = async () => {
      try {
        const response = await fetch('/api/whatsapp/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            sessionId, 
            couponCode
          }),
        });

        const data = await response.json();

        if (data.isPaired) {
          setIsPaired(true);
          toast({
            title: "Already Paired",
            description: "Your WhatsApp is already connected. Loading dashboard...",
          });
        }
      } catch (error) {
        console.error('Failed to initialize connection:', error);
      }
    };

    initializeConnection();

    const pollQrCode = setInterval(async () => {
      try {
        const response = await fetch(`/api/whatsapp/qr/${sessionId}`);
        const data = await response.json();

        setQrCode(data.qrCode);
        setIsReady(data.isReady);
        setIsPaired(data.isPaired);
        setMessageCount(data.messageCount);

        if (data.analyticsId) {
          setAnalyticsId(data.analyticsId);
        }

        if (data.isReady && !isReady) {
          toast({
            title: "Connected!",
            description: "Your WhatsApp is now paired. Messages are being analyzed.",
          });
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    }, 2000);

    return () => clearInterval(pollQrCode);
  }, [sessionId, couponCode]);

  const handleViewAnalytics = async () => {
    if (analyticsId) {
      const analytics = await fetch(`/api/analytics/${analyticsId}`).then(r => r.json());
      setAnalytics(analytics);
      setLocation('/overview');
    } else {
      try {
        const response = await fetch(`/api/whatsapp/generate-analytics/${sessionId}`, {
          method: 'POST',
        });
        const data = await response.json();

        if (data.analyticsId) {
          const analytics = await fetch(`/api/analytics/${data.analyticsId}`).then(r => r.json());
          setAnalytics(analytics);
          setLocation('/overview');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate analytics. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (isPaired && isReady) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="p-8 border-2 border-green-500">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500/10 p-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">Already Connected!</h3>
              <p className="text-muted-foreground">
                Your WhatsApp is paired and being monitored
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Messages Collected</p>
                <p className="text-3xl font-bold font-mono">{messageCount}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold text-green-500">Active</p>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full"
              onClick={handleViewAnalytics}
            >
              View Analytics Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="rounded-full bg-primary/10 p-6 w-fit mx-auto">
          <Smartphone className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Pair Your WhatsApp</h1>
        <p className="text-xl text-muted-foreground">
          Scan the QR code to connect your WhatsApp
        </p>
      </div>

      {qrCode && (
        <Card className="p-8">
          <div className="space-y-6">
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
            </div>

            <div className="space-y-3 text-sm text-center">
              <p className="font-semibold">How to pair:</p>
              <ol className="text-left space-y-2 max-w-md mx-auto">
                <li>1. Open WhatsApp on your phone</li>
                <li>2. Tap Menu (⋮) or Settings</li>
                <li>3. Tap "Linked Devices"</li>
                <li>4. Tap "Link a Device"</li>
                <li>5. Scan this QR code</li>
              </ol>
            </div>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Waiting for you to scan...</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
