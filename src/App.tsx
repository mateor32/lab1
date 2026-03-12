import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Link, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Transfers from "./pages/Transfers";
import NotFound from "./pages/NotFound";
import { LayoutDashboard, Users, ArrowLeftRight, Building2 } from "lucide-react";
import { cn } from "./lib/utils";

const queryClient = new QueryClient();

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/transfers", label: "Transfers", icon: ArrowLeftRight },
];

const NavBar = () => {
  const { pathname } = useLocation();
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 flex items-center h-16 gap-1">
        <Link to="/" className="flex items-center gap-2.5 mr-8 group">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-primary transition-transform duration-200 group-hover:scale-105">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">NovaPay</span>
        </Link>
        <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-all duration-200 px-4 py-2 rounded-lg",
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <NavBar />
          <main className="max-w-6xl mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transfers" element={<Transfers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
