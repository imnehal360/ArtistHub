import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes Import
import authRoutes from './routes/authRoutes.js';
import artworkRoutes from './routes/artworkRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Error Handler Middleware
import { errorHandler } from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading local uploads in browser from client
}));

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local static uploads fallback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200, // limit each IP to 200 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', limiter);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

// 404 Route handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

export default app;
