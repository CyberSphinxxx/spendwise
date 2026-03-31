// admin/src/context/AuthContext.jsx
// ⚠️ MOCK MODE — No backend required. All auth is simulated locally.
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Mock admin users
const MOCK_ADMINS = [
    { id: '1', name: 'Admin User', email: 'admin@spendwise.com', role: 'admin', password: 'demo123' },
    { id: '2', name: 'Super Admin', email: 'admin@example.com', role: 'admin', password: 'admin123' },
];

// Mock data returned by authFetch
const MOCK_API_DATA = {
    '/admin/stats': {
        totalUsers: 24,
        totalInvestments: 18,
        totalInvestmentValue: 284500,
        totalSavings: 31,
        totalSavedAmount: 92400,
        totalLoans: 12,
        totalLoanRemaining: 156000,
        pendingLoans: 3,
    },
    '/admin/users': [
        { _id: 'u001', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
        { _id: 'u002', name: 'Carlos Reyes', email: 'carlos@example.com', role: 'user', createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
        { _id: 'u003', name: 'Maria Santos', email: 'maria@example.com', role: 'user', createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
        { _id: 'u004', name: 'Jose Cruz', email: 'jose@example.com', role: 'user', createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
        { _id: 'u005', name: 'Ana Dela Cruz', email: 'ana@example.com', role: 'user', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        { _id: 'u006', name: 'Admin User', email: 'admin@spendwise.com', role: 'admin', createdAt: new Date(Date.now() - 86400000 * 60).toISOString() },
    ],
    '/admin/loans': [
        {
            _id: 'l001', amount: 50000, remainingBalance: 42000, purpose: 'Home Improvement',
            termMonths: 24, interestRate: 5.5, monthlyPayment: 2200, status: 'pending',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            user: { name: 'Sarah Johnson', email: 'sarah@example.com' }
        },
        {
            _id: 'l002', amount: 25000, remainingBalance: 18000, purpose: 'Business Capital',
            termMonths: 12, interestRate: 6.0, monthlyPayment: 2150, status: 'pending',
            createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
            user: { name: 'Carlos Reyes', email: 'carlos@example.com' }
        },
        {
            _id: 'l003', amount: 15000, remainingBalance: 0, purpose: 'Education',
            termMonths: 6, interestRate: 4.0, monthlyPayment: 2550, status: 'paid',
            createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
            user: { name: 'Maria Santos', email: 'maria@example.com' }
        },
        {
            _id: 'l004', amount: 80000, remainingBalance: 65000, purpose: 'Vehicle Purchase',
            termMonths: 36, interestRate: 7.0, monthlyPayment: 2470, status: 'active',
            createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
            user: { name: 'Jose Cruz', email: 'jose@example.com' }
        },
    ],
    '/admin/reports': {
        monthlyRevenue: [12000, 14500, 13800, 16200, 15000, 17800],
        months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    },
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('adminToken') || null);

    // Restore session from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('adminMockUser');
        if (stored) {
            try {
                setCurrentUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('adminMockUser');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 500));

        const found = MOCK_ADMINS.find(u => u.email === email && u.password === password);

        if (found) {
            const user = { id: found.id, name: found.name, email: found.email, role: found.role };
            localStorage.setItem('adminMockUser', JSON.stringify(user));
            localStorage.setItem('adminToken', 'mock-admin-token-' + found.id);
            setToken('mock-admin-token-' + found.id);
            setCurrentUser(user);
            return user;
        }

        // Allow any email login as admin for easy testing
        if (email && password) {
            const user = {
                id: 'admin-' + Date.now(),
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                email,
                role: 'admin'
            };
            localStorage.setItem('adminMockUser', JSON.stringify(user));
            localStorage.setItem('adminToken', 'mock-admin-token-guest');
            setToken('mock-admin-token-guest');
            setCurrentUser(user);
            return user;
        }

        throw new Error('Please enter both email and password');
    };

    const logout = () => {
        localStorage.removeItem('adminMockUser');
        localStorage.removeItem('adminToken');
        setToken(null);
        setCurrentUser(null);
    };

    // Mock authFetch — returns mock JSON responses
    const authFetch = async (endpoint, options = {}) => {
        await new Promise(r => setTimeout(r, 300)); // simulate delay

        // Handle PUT/POST with optimistic mock response
        if (options.method === 'PUT' || options.method === 'POST') {
            return {
                ok: true,
                json: async () => ({ success: true, message: 'Operation successful' })
            };
        }

        const data = MOCK_API_DATA[endpoint];
        if (data !== undefined) {
            return {
                ok: true,
                json: async () => data
            };
        }

        // Unknown endpoint - return empty ok response
        return {
            ok: true,
            json: async () => ({})
        };
    };

    const value = {
        currentUser,
        login,
        logout,
        loading,
        authFetch,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
