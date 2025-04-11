// src/contexts/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign in function - in a real app, this would make an API call
  function login(email, password) {
    return new Promise((resolve, reject) => {
      // Mock implementation - replace with actual API call
      if (email && password) {
        const userData = { id: 1, email, name: "User" };
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        resolve(userData);
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  }

  // Sign up function - in a real app, this would make an API call
  function signup(name, email, password) {
    return new Promise((resolve, reject) => {
      // Mock implementation - replace with actual API call
      if (name && email && password) {
        const userData = { id: 1, email, name };
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        resolve(userData);
      } else {
        reject(new Error('Invalid information'));
      }
    });
  }

  // Sign out function
  function logout() {
    localStorage.removeItem('user');
    setCurrentUser(null);
  }

  // Check if user is logged in on initial load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}