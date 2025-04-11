// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from "./components/Navbar";
import LandingPage from "./components/pages/LandingPage";
import Signup from "./components/SignUp";
import { AuthProvider } from "./components/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from 'sonner';

function App() {
  return (
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Nav />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
  );
}

export default App;