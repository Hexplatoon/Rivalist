// Navbar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, UserCircle, Users } from "lucide-react";
import LoginPage from "./LoginPage"; // Import your LoginPage component

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    setShowLogin(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-2">
          {/* Left: Site Name */}
          <Link to="/" className="text-xl font-bold tracking-tight text-white">
            Rivalist
          </Link>

          {/* Right: Auth Buttons or Logged-in Icons */}
          <div className="flex items-center space-x-4">
            {!loggedIn ? (
              <>
                <Button
                  variant="outline"
                  className="border-white/40 text-black hover:bg-white/10 hover:text-white"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </Button>
                <Button
                  className="bg-white/10 text-white hover:bg-white/20"
                  onClick={() => setLoggedIn(true)}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Users className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Login Overlay */}
      {showLogin && (
  <div className="fixed inset-0 z-[60]">
    {/* Glassy overlay background */}
    <div 
      className="absolute inset-0 bg-black/30 backdrop-blur-lg"
      onClick={() => setShowLogin(false)} // Close when clicking outside
    />
    
    {/* Centered login form with glass panel effect */}
    <div className="relative flex items-center justify-center h-full w-full p-4">
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setShowLogin(false)}
      />
    </div>
  </div>
)}

    </>
  );
}