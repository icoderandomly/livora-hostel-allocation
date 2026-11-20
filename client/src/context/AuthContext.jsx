import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hostel_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('hostel_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user on start or verify existing token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('hostel_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('hostel_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('hostel_token', receivedToken);
      localStorage.setItem('hostel_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (studentData) => {
    const res = await authService.register(studentData);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('hostel_token', receivedToken);
      localStorage.setItem('hostel_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    try {
      authService.logout().catch(() => {});
    } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('hostel_token');
    localStorage.removeItem('hostel_user');
  };

  const updateProfile = async (data) => {
    const res = await authService.updateProfile(data);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('hostel_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data.message || 'Update failed');
  };

  const changePassword = async (data) => {
    const res = await authService.changePassword(data);
    return res.data;
  };

  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isStudent,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
