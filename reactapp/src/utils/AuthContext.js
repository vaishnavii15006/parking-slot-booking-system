import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister } from './api';

const LS_USERS_KEY = 'demo_users';
const LS_CURRENT_KEY = 'user';
const AuthContext = createContext(null);

function seedDemoUsers() {
  const existing = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
  if (existing.length === 0) {
    const seeded = [
      { id: 1, username: 'demo@user.com', password: 'demo123', role: 'user' },
      { id: 2, username: 'admin@parkeasy.com', password: 'admin123', role: 'admin' }
    ];
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(seeded));
  }
}

function lsFindUser(username, password) {
  const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
  return users.find(u => u.username === username && u.password === password) || null;
}

function lsCreateUser(username, password, role) {
  const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
  if (users.some(u => u.username === username)) {
    throw new Error('User already exists');
  }
  const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const created = { id: nextId, username, password, role };
  users.push(created);
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
  return created;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    seedDemoUsers();
    const storedUser = localStorage.getItem(LS_CURRENT_KEY);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async ({ username, password }) => {
    try {
      const res = await apiLogin(username, password); // backend happy path
      setUser(res);
      localStorage.setItem(LS_CURRENT_KEY, JSON.stringify(res));
      return { success: true };
    } catch (err) {
      // Fallback: localStorage users
      const local = lsFindUser(username, password);
      if (local) {
        setUser(local);
        localStorage.setItem(LS_CURRENT_KEY, JSON.stringify(local));
        return { success: true };
      }
      return {
        success: false,
        message: err?.response?.data?.message || 'Invalid credentials'
      };
    }
  };

 

  const register = async ({ username, password, role = 'user' }) => {
    try {
      const res = await apiRegister({ username, passwordHash: password, role });
      setUser(res);
      localStorage.setItem(LS_CURRENT_KEY, JSON.stringify(res));
      return { success: true };
    } catch (err) {
      try {
        const created = lsCreateUser(username, password, role);
        setUser(created);
        localStorage.setItem(LS_CURRENT_KEY, JSON.stringify(created));
        return { success: true };
      } catch (localErr) {
        return {
          success: false,
          message:
            err?.response?.data?.message ||
            localErr?.message ||
            'Registration failed'
        };
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_CURRENT_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      login: async () => ({ success: false, message: 'No AuthProvider' }),
      register: async () => ({ success: false, message: 'No AuthProvider' }),
      logout: () => {}
    };
  }
  return context;
};