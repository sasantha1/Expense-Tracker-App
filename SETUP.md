# Setup Instructions

## Quick Start Guide

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: 
- If you're using MongoDB Atlas (cloud), replace `MONGODB_URI` with your connection string
- Change `JWT_SECRET` to a secure random string in production

Start MongoDB (if running locally):
- Windows: Make sure MongoDB service is running
- Mac/Linux: `sudo systemctl start mongod` or `brew services start mongodb-community`

Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

### 3. First Use

1. Click "Sign up" to create a new account
2. Enter your name, email, and password (min 6 characters)
3. After registration, you'll be automatically logged in
4. Start adding your income and expense transactions!

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running on your system
- Check that the connection string in `.env` is correct
- If using MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: The terminal will prompt you to use a different port

### CORS Issues
- Make sure the backend is running before starting the frontend
- Check that the proxy setting in `frontend/package.json` matches your backend port

## Production Build

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

The optimized build will be in the `frontend/build` directory, ready to be served by any static file server.
