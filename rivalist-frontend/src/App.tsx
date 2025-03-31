
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BattlePage from "./pages/BattlePage";
import CodeforcesSettingsPage from "./pages/CodeforcesSettingsPage";
import FriendsListPage from "./pages/FriendsListPage";
import MatchmakingPage from "./pages/MatchmakingPage";
import WaitingPage from "./pages/WaitingPage";
import BattleRoomPage from "./pages/BattleRoomPage";
import BattleResultsPage from "./pages/BattleResultsPage";
import DashboardPage from "./pages/DashboardPage";
import FriendsPage from "./pages/FriendsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/battle/:battleType" element={<BattlePage />} />
          <Route path="/battle/codeforces/settings" element={<CodeforcesSettingsPage />} />
          <Route path="/battle/:battleType/friends" element={<FriendsListPage />} />
          <Route path="/battle/:battleType/matchmaking" element={<MatchmakingPage />} />
          <Route path="/battle/:battleType/waiting" element={<WaitingPage />} />
          <Route path="/battle/:battleType/room" element={<BattleRoomPage />} />
          <Route path="/battle/:battleType/results" element={<BattleResultsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
