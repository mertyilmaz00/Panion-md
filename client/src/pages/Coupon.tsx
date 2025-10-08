import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Coupon() {
  const [, setLocation] = useLocation();
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid coupon');
      }

      toast({
        title: "Success!",
        description: "Coupon validated. Redirecting to WhatsApp pairing...",
      });

      localStorage.setItem('sessionId', data.sessionId);
      localStorage.setItem('couponCode', couponCode.trim());
      
      setTimeout(() => {
        setLocation('/pair-whatsapp');
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Invalid Coupon",
        description: error.message || "Please check your coupon code and try again",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="rounded-full bg-primary/10 p-6 w-fit mx-auto">
          <Ticket className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Enter Your Coupon Code</h1>
        <p className="text-xl text-muted-foreground">
          Get real-time WhatsApp analytics by pairing your account
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="coupon" className="text-sm font-medium">
              Coupon Code
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
              Enter the coupon code you received to activate real-time monitoring
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={loading}
          >
            {loading ? (
              "Validating..."
            ) : (
              <>
                Activate & Pair WhatsApp
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have a coupon?{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => setLocation('/')}
          >
            Try quick analysis instead
          </Button>
        </p>
      </div>
    </div>
  );
}
