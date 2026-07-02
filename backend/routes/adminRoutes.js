import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getPlatformStats,
  getUsersList,
  updateUserRole,
  deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

// Secure all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getUsersList);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
