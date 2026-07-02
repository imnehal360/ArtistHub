import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  getArtistProfile,
  updateArtistProfile,
  toggleFollowArtist,
  getTrendingArtists,
  getArtistAnalytics
} from '../controllers/artistController.js';

const router = express.Router();

router.get('/trending/list', getTrendingArtists);
router.get('/profile/:username', getArtistProfile);

// Protected routes
router.put(
  '/profile',
  protect,
  authorize('artist'),
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  updateArtistProfile
);
router.post('/:id/follow', protect, toggleFollowArtist);
router.get('/dashboard/analytics', protect, authorize('artist'), getArtistAnalytics);

export default router;
