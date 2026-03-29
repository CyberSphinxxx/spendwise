const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAccounts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/spendwise');
        console.log('Connected to MongoDB');

        // Check if admin exists
        let admin = await User.findOne({ email: 'admin@wealthwise.com' });
        if (!admin) {
            admin = await User.create({
                name: 'WealthWise Admin',
                email: 'admin@wealthwise.com',
                password: 'admin123',
                role: 'admin',
                balance: 0
            });
            console.log('✅ Admin account created: admin@wealthwise.com / admin123');
        } else {
            console.log('✅ Admin account already exists. Updating password and role...');
            admin.password = 'admin123';
            admin.role = 'admin';
            await admin.save();
        }

        // Check if regular user exists
        let user = await User.findOne({ email: 'user@wealthwise.com' });
        if (!user) {
            user = await User.create({
                name: 'Demo User',
                email: 'user@wealthwise.com',
                password: 'user123',
                role: 'user',
                balance: 50000
            });
            console.log('✅ Mobile user account created: user@wealthwise.com / user123');
        } else {
            console.log('✅ Mobile user account already exists. Updating password...');
            user.password = 'user123';
            await user.save();
        }

        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedAccounts();
