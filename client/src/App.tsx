import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  MessageSquare,
  Clock,
  Image as ImageIcon,
  Heart,
  Phone,
  Settings,
  Sparkles,
  Home,
} from "lucide-react";
import { useLocation } from "wouter";
import Overview from "@/pages/Overview";
import Messages from "@/pages/Messages";
import Activity from "@/pages/Activity";
import Media from "@/pages/Media";
import Behavior from "@/pages/Behavior";
import Emotional from "@/pages/Emotional";
import Calls from "@/pages/Calls";
import System from "@/pages/System";
import AIInsights from "@/pages/AIInsights";
import Upload from "@/pages/Upload";
import Coupon from "./pages/Coupon";
import Login from "./pages/Login";
import PairWhatsApp from "./pages/PairWhatsApp";

const menuItems = [
  { title: "Overview", url: "/overview", icon: Home },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Activity", url: "/activity", icon: Clock },
  { title: "Media & Status", url: "/media", icon: ImageIcon },
  { title: "Behavior", url: "/behavior", icon: BarChart3 },
  { title: "Emotional", url: "/emotional", icon: Heart },
  { title: "Calls", url: "/calls", icon: Phone },
  { title: "System", url: "/system", icon: Settings },
  { title: "AI Insights", url: "/ai-insights", icon: Sparkles },
];

function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-primary mb-2">
            WhatsApp Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      data-active={isActive}
                      className="data-[active=true]:bg-sidebar-accent"
                    >
                      <a href={item.url} data-testid={`link-${item.url.slice(1)}`}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Upload} />
      <Route path="/coupon" component={Coupon} />
      <Route path="/login" component={Login} />
      <Route path="/pair-whatsapp" component={PairWhatsApp} />
      <Route path="/overview" component={Overview} />
      <Route path="/messages" component={Messages} />
      <Route path="/activity" component={Activity} />
      <Route path="/media" component={Media} />
      <Route path="/behavior" component={Behavior} />
      <Route path="/emotional" component={Emotional} />
      <Route path="/calls" component={Calls} />
      <Route path="/system" component={System} />
      <Route path="/ai-insights" component={AIInsights} />
    </Switch>
  );
}

export default function App() {
  const [location] = useLocation();
  const showSidebar = location !== "/" && location !== "/coupon" && location !== "/pair-whatsapp" && location !== "/login";

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          {showSidebar ? (
            <SidebarProvider style={style as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <header className="flex items-center justify-between p-4 border-b">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <ThemeToggle />
                  </header>
                  <main className="flex-1 overflow-auto p-8">
                    <Router />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          ) : (
            <div className="min-h-screen bg-background">
              <header className="flex items-center justify-end p-4 border-b">
                <ThemeToggle />
              </header>
              <main className="p-8">
                <Router />
              </main>
            </div>
          )}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
