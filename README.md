# SpendWise / WealthWise Setup Guide

Welcome to the project! Since you just cloned this repository from GitHub, **you are missing some files that are deliberately excluded from version control.**

Specifically, you are missing:
1. **`node_modules`** - You need to install dependencies for each specific part of the app.
2. **`.env`** - The environment variables containing the database connection and secret passwords.

Follow these steps exactly to get the project running locally without errors.

---

## Step 1: Install Dependencies
This project has 4 different directories that need their packages installed. Open your terminal and run the following commands sequentially:

```bash
# 1. Install root dependencies (Main web app)
npm install

# 2. Install backend server dependencies
cd server
npm install
cd ..

# 3. Install admin portal dependencies
cd admin
npm install
cd ..

# 4. Install mobile app dependencies
cd mobile
npm install
cd ..
```

## Step 2: Setup Environment Variables
Because passwords and database keys should not be pushed to GitHub, you won't have a `.env` file in the `server` directory.

1. Go into the `server` folder.
2. You will see a file named `.env.example`.
3. Rename or copy this file to `.env` (just `.env` - no name before the dot).
4. Open the new `.env` file and replace the `<username>:<password>` placeholder in the `MONGO_URI` with the actual database credentials provided by the team.

## Step 3: Run the Development Servers
You will need multiple terminal windows (or split terminal) to run all parts of the application at once.

**Terminal 1: Start the Backend Server**
```bash
cd server
npm start
```

**Terminal 2: Start the Web App (Frontend)**
```bash
npm run dev
```

**Terminal 3: Start the Admin Portal**
```bash
cd admin
npm run dev
```

**Terminal 4: Start the Mobile App (React Native/Expo)**
```bash
cd mobile
npx expo start
```

## Need Help?
If you encounter `Failed to fetch` or `Unauthorized 401` errors when logging in, make sure your **Backend Server** is currently running and that you connected to the right MongoDB database in your `.env` file.
