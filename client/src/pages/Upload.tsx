import { FileUpload } from "@/components/FileUpload";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Shield, User } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { setAnalytics } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const [, setLocation] = useLocation();
  const [uploading, setUploading] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    console.log('File selected:', file.name);
    setUploading(true);
    setSelectedFile(file);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      
      if (data.requiresUserSelection && data.participants) {
        setParticipants(data.participants);
        setShowUserSelection(true);
        setUploading(false);
      } else {
        setAnalytics(data.analytics);
        
        toast({
          title: "Success!",
          description: "Your WhatsApp data has been analyzed.",
        });
        
        setLocation('/overview');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze file. Please ensure it's a valid WhatsApp export.",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  const handleUserSelection = async (userName: string) => {
    if (!selectedFile) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userName', userName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      setAnalytics(data.analytics);
      
      toast({
        title: "Success!",
        description: "Your WhatsApp data has been analyzed.",
      });
      
      setLocation('/overview');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze file.",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  if (showUserSelection) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <User className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Select Your Identity</h1>
          <p className="text-lg text-muted-foreground">
            Which participant in this chat are you?
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-3">
            {participants.map((participant) => (
              <Button
                key={participant}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => handleUserSelection(participant)}
                disabled={uploading}
                data-testid={`button-select-user-${participant}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {participant[0]}
                  </div>
                  <span className="text-lg">{participant}</span>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">WhatsApp Analytics Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Discover insights about your messaging habits and digital wellbeing
        </p>
        <div className="pt-2 flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => setLocation('/coupon')}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            New User? Pair WhatsApp
          </Button>
          <Button
            variant="default"
            onClick={() => setLocation('/login')}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Already Connected? Login
          </Button>
        </div>
      </div>

      <FileUpload onFileSelect={handleFileSelect} />

      {uploading && (
        <Card className="p-6 text-center">
          <div className="space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            <p className="text-lg font-medium">Analyzing your chat data...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Export Your Chat</h3>
          <p className="text-sm text-muted-foreground">
            Open WhatsApp, go to a chat, tap Menu → More → Export chat → Without media
          </p>
        </Card>

        <Card className="p-6">
          <div className="rounded-lg bg-chart-1/10 p-3 w-fit mb-4">
            <Shield className="h-6 w-6 text-chart-1" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
          <p className="text-sm text-muted-foreground">
            All analysis happens in your browser. Your data never leaves your device
          </p>
        </Card>

        <Card className="p-6">
          <div className="rounded-lg bg-chart-2/10 p-3 w-fit mb-4">
            <Download className="h-6 w-6 text-chart-2" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Get Insights</h3>
          <p className="text-sm text-muted-foreground">
            View activity patterns, sentiment analysis, and personalized recommendations
          </p>
        </Card>
      </div>

      <Card className="p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-3">How to Export WhatsApp Chat</h3>
        <ol className="space-y-2 text-sm list-decimal list-inside">
          <li>Open WhatsApp on your phone</li>
          <li>Go to the chat you want to analyze</li>
          <li>Tap the three dots (Menu) in the top right</li>
          <li>Select "More" → "Export chat"</li>
          <li>Choose "Without Media" to get a smaller file</li>
          <li>Save the .txt file and upload it here</li>
        </ol>
      </Card>
    </div>
  );
}
