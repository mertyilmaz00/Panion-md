import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter your coupon code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check if this coupon has an existing paired session
      const response = await fetch('/api/whatsapp/check-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: couponCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Session not found');
      }

      if (!data.isPaired) {
        toast({
          title: "Not Paired",
          description: "This coupon hasn't been paired yet. Please pair your WhatsApp first.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store session info
      localStorage.setItem('sessionId', data.sessionId);
      localStorage.setItem('couponCode', couponCode.trim());
      
      toast({
        title: "Login Successful!",
        description: "Redirecting to your dashboard...",
      });

      setTimeout(() => {
        setLocation('/pair-whatsapp');
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid coupon code or session not found",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="rounded-full bg-primary/10 p-6 w-fit mx-auto">
          <LogIn className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <p className="text-xl text-muted-foreground">
          Login with your coupon code to access your analytics
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="coupon" className="text-sm font-medium">
              Your Coupon Code
            </label>
            <Input
              id="coupon"
              type="text"
              placeholder="PANION-XXXXX"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="text-lg font-mono"
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Enter the same coupon code you used to pair your WhatsApp
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Access Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          First time here?{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => setLocation('/coupon')}
          >
            Pair your WhatsApp
          </Button>
        </p>
      </div>
    </div>
  );
}
