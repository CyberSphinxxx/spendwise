// src/data/mockApi.js

// In-memory mock database for development
let mockExpenses = [
    { _id: '1', date: new Date().toISOString(), description: 'Gas Station', category: 'Transport', amount: 45.50 },
    { _id: '2', date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Groceries', category: 'Food & Dining', amount: 120.00 },
    { _id: '3', date: new Date(Date.now() - 86400000 * 5).toISOString(), description: 'Electric Bill', category: 'Utilities', amount: 75.00 },
    { _id: '4', date: new Date(Date.now() - 86400000 * 7).toISOString(), description: 'Coffee', category: 'Food & Dining', amount: 5.50 },
    { _id: '5', date: new Date(Date.now() - 86400000 * 10).toISOString(), description: 'Clothing', category: 'Shopping', amount: 65.00 }
];

export const getExpenses = async () => {
    // Simulate network delay
    return new Promise(resolve => {
        setTimeout(() => resolve([...mockExpenses]), 200);
    });
};

export const addExpense = async (expense) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newExpense = { ...expense, _id: Date.now().toString() };
            mockExpenses = [newExpense, ...mockExpenses];
            resolve(newExpense);
        }, 300);
    });
};

export const deleteExpense = async (id) => {
    return new Promise(resolve => {
        setTimeout(() => {
            mockExpenses = mockExpenses.filter(e => e._id !== id);
            resolve({ success: true });
        }, 200);
    });
};
