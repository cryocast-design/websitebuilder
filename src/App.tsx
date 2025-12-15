import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WhopProvider } from "@/contexts/WhopContext";
import { Toaster } from "@/components/ui/sonner";
import WhopDashboard from "./pages/WhopDashboard";
import Home from "./pages/Home";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WhopProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Home/Landing page */}
            <Route path="/" element={<Home />} />
            
            {/* WHOP Dashboard - all app routes go through here */}
            <Route path="/dashboard/:companyId" element={<WhopDashboard />} />
            <Route path="/dashboard/:companyId/*" element={<WhopDashboard />} />
            
            {/* Fallback route - show home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </WhopProvider>
    </QueryClientProvider>
  );
}

export default App;
