import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WhopProvider } from "@/contexts/WhopContext";
import { Toaster } from "@/components/ui/sonner";
import WhopDashboard from "./pages/WhopDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WhopProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* WHOP Dashboard - all app routes go through here */}
            <Route path="/dashboard/:companyId" element={<WhopDashboard />} />
            <Route path="/dashboard/:companyId/*" element={<WhopDashboard />} />
            
            {/* Fallback route */}
            <Route path="*" element={<WhopDashboard />} />
          </Routes>
        </BrowserRouter>
      </WhopProvider>
    </QueryClientProvider>
  );
}

export default App;
