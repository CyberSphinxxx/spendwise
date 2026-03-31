// mobile/context/AuthContext.js
// ⚠️ MOCK MODE — No backend required. All auth and API calls are simulated.
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

// Mock user database
const MOCK_USERS = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user', password: 'demo123' },
    { id: '2', name: 'Carlos Reyes', email: 'carlos@example.com', role: 'user', password: 'demo123' },
    { id: '3', name: 'Admin User', email: 'admin@spendwise.com', role: 'admin', password: 'demo123' },
];

// Mock API responses keyed by endpoint
const MOCK_RESPONSES = {
    '/investments/summary': { totalValue: 125400, totalProfitLoss: 8250, count: 5 },
    '/savings/summary': { totalSaved: 45200, activeGoals: 3 },
    '/loans/summary': { totalRemaining: 28000, activeLoans: 2 },
    '/budgets/summary': { totalSpent: 12400, totalLimit: 20000 },
    '/investments': [
        { _id: 'i1', name: 'BPI Stock', type: 'stocks', amount: 50000, currentValue: 58000, profitLoss: 8000, date: new Date(Date.now() - 86400000 * 30).toISOString() },
        { _id: 'i2', name: 'PAGIBIG Fund', type: 'bonds', amount: 30000, currentValue: 30750, profitLoss: 750, date: new Date(Date.now() - 86400000 * 60).toISOString() },
        { _id: 'i3', name: 'Crypto BTC', type: 'crypto', amount: 20000, currentValue: 19600, profitLoss: -400, date: new Date(Date.now() - 86400000 * 15).toISOString() },
    ],
    '/savings': [
        { _id: 's1', name: 'Emergency Fund', targetAmount: 50000, currentAmount: 25000, deadline: new Date(Date.now() + 86400000 * 180).toISOString() },
        { _id: 's2', name: 'Vacation Fund', targetAmount: 30000, currentAmount: 12000, deadline: new Date(Date.now() + 86400000 * 90).toISOString() },
        { _id: 's3', name: 'New Laptop', targetAmount: 60000, currentAmount: 8200, deadline: new Date(Date.now() + 86400000 * 270).toISOString() },
    ],
    '/loans': [
        { _id: 'ln1', purpose: 'Home Improvement', amount: 50000, remainingBalance: 18000, termMonths: 24, interestRate: 5.5, monthlyPayment: 2200, status: 'active', nextPaymentDate: new Date(Date.now() + 86400000 * 10).toISOString() },
        { _id: 'ln2', purpose: 'Education', amount: 15000, remainingBalance: 10000, termMonths: 12, interestRate: 4.0, monthlyPayment: 1300, status: 'active', nextPaymentDate: new Date(Date.now() + 86400000 * 5).toISOString() },
    ],
    '/budgets': [
        { _id: 'b1', category: 'Food & Dining', limit: 8000, spent: 5400, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
        { _id: 'b2', category: 'Transport', limit: 3000, spent: 2100, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
        { _id: 'b3', category: 'Entertainment', limit: 2000, spent: 800, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
        { _id: 'b4', category: 'Shopping', limit: 5000, spent: 4100, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
        { _id: 'b5', category: 'Health', limit: 2000, spent: 0, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
    ],
};

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // Restore session from AsyncStorage on mount
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const stored = await AsyncStorage.getItem('mockUser');
                const storedToken = await AsyncStorage.getItem('token');
                if (stored && storedToken) {
                    setCurrentUser(JSON.parse(stored));
                    setToken(storedToken);
                }
            } catch (err) {
                console.log('Session restore failed:', err.message);
            }
            setLoading(false);
        };
        restoreSession();
    }, []);

    const login = async (email, password) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));

        const found = MOCK_USERS.find(u => u.email === email && u.password === password);

        if (found) {
            const user = { id: found.id, name: found.name, email: found.email, role: found.role };
            await AsyncStorage.setItem('mockUser', JSON.stringify(user));
            await AsyncStorage.setItem('token', 'mock-jwt-token-' + found.id);
            setToken('mock-jwt-token-' + found.id);
            setCurrentUser(user);
            return user;
        }

        // Allow any email/password for easy testing
        if (email && password) {
            const user = {
                id: 'guest-' + Date.now(),
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                email,
                role: 'user',
            };
            await AsyncStorage.setItem('mockUser', JSON.stringify(user));
            await AsyncStorage.setItem('token', 'mock-jwt-token-guest');
            setToken('mock-jwt-token-guest');
            setCurrentUser(user);
            return user;
        }

        throw new Error('Please enter both email and password');
    };

    const signup = async (name, email, password) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!name || !email || !password) {
            throw new Error('All fields are required');
        }

        const user = {
            id: 'user-' + Date.now(),
            name,
            email,
            role: 'user',
        };
        await AsyncStorage.setItem('mockUser', JSON.stringify(user));
        await AsyncStorage.setItem('token', 'mock-jwt-token-' + user.id);
        setToken('mock-jwt-token-' + user.id);
        setCurrentUser(user);
        return user;
    };

    const logout = async () => {
        await AsyncStorage.removeItem('mockUser');
        await AsyncStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
    };

    const getToken = async () => {
        return await AsyncStorage.getItem('token');
    };

    // Mock authFetch — returns mock API responses without hitting the backend
    const authFetch = async (url, options = {}) => {
        await new Promise(resolve => setTimeout(resolve, 300)); // simulate network delay

        // Handle mutations optimistically
        if (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE') {
            return {
                ok: true,
                json: async () => ({ success: true, _id: 'new-' + Date.now(), ...JSON.parse(options.body || '{}') })
            };
        }

        // Match endpoint to mock data
        const key = Object.keys(MOCK_RESPONSES).find(k => url.endsWith(k) || url.includes(k));
        const data = key ? MOCK_RESPONSES[key] : {};

        return {
            ok: true,
            json: async () => data
        };
    };

    const value = {
        currentUser,
        login,
        signup,
        logout,
        loading,
        token,
        getToken,
        authFetch,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
