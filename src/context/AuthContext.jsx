// src/context/AuthContext.jsx
// ⚠️ MOCK MODE — No backend required. All auth is simulated locally.
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Mock user database
const MOCK_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@spendwise.com', role: 'admin', password: 'demo123' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user', password: 'demo123' },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('mockUser');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('mockUser');
      }
    }
    setLoading(false);
  }, []);

  // Mock login — accepts demo accounts or any email/password
  const login = async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const found = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (found) {
      const user = { id: found.id, name: found.name, email: found.email, role: found.role };
      localStorage.setItem('mockUser', JSON.stringify(user));
      localStorage.setItem('token', 'mock-jwt-token-' + found.id);
      setCurrentUser(user);
      return user;
    }

    // Allow any email/password combo for easy testing
    if (email && password) {
      const user = {
        id: 'guest-' + Date.now(),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email,
        role: 'user'
      };
      localStorage.setItem('mockUser', JSON.stringify(user));
      localStorage.setItem('token', 'mock-jwt-token-guest');
      setCurrentUser(user);
      return user;
    }

    throw new Error('Please enter both email and password');
  };

  // Mock signup
  const signup = async (email, password, name) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }

    const user = {
      id: 'user-' + Date.now(),
      name,
      email,
      role: 'user'
    };
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('token', 'mock-jwt-token-' + user.id);
    setCurrentUser(user);
    return user;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('mockUser');
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Helper to get token for API calls (returns mock token)
  const getToken = () => localStorage.getItem('token');

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}