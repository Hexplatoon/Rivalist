import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Signup from "./components/SignUp";
import { AuthProvider, useAuth } from "./utils/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "sonner";
import FriendsPage from "./pages/FriendsPage";
import { StompProvider } from "./utils/StompContext";
import { LoginProvider } from "./utils/LoginContext";
import WaitingRoom from "./pages/WaitingRoom";
import TypingTest from "./components/TypingBattle";
import BattlePage from "./pages/BattlePage";
import BattleResults from "./components/BattleResult";
import CSSBattleClone from "./components/CSSBattleClone";

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Nav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/room" element={<WaitingRoom/>}/>
          <Route path="/battle" element={<BattlePage/>}/>
          <Route path="/battleresult" element={<BattleResults/>}/>
        </Route>
        <Route path="/test" element={<CSSBattleClone/>}/>
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <StompProvider>
        <LoginProvider>
          <AppContent />
        </LoginProvider>
      </StompProvider>
    </AuthProvider>
  );
}

export default App;
