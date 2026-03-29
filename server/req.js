const createUsers = async () => {
    try {
        const r1 = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Admin', email: 'admin@wealthwise.com', password: 'admin123', role: 'admin' })
        });
        console.log('Admin:', await r1.json());

        const r2 = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Demo User', email: 'user@wealthwise.com', password: 'user123' })
        });
        console.log('User:', await r2.json());
    } catch (e) {
        console.error(e);
    }
};
createUsers();
