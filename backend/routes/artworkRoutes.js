import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  uploadArtwork,
  getArtworks,
  getArtworkById,
  toggleLikeArtwork,
  deleteArtwork,
  getSearchSuggestions,
  getRelatedArtworks
} from '../controllers/artworkController.js';

const router = express.Router();

router.get('/', getArtworks);
router.get('/suggestions', getSearchSuggestions);
router.get('/:id', getArtworkById);
router.get('/:id/related', getRelatedArtworks);

// Protected routes
router.post('/', protect, authorize('artist', 'admin'), upload.array('images', 5), uploadArtwork);
router.post('/:id/like', protect, toggleLikeArtwork);
router.delete('/:id', protect, deleteArtwork);

export default router;
