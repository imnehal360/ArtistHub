import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';

// Load Env variables
dotenv.config();

// Establish Database Connection
connectDB();

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running in production-ready mode on port ${PORT}`);
  console.log(`🔗 Frontend connection configured for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
