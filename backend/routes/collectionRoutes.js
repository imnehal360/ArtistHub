import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createCollection,
  addArtworkToCollection,
  removeArtworkFromCollection,
  getUserCollections,
  getCollectionById
} from '../controllers/collectionController.js';

const router = express.Router();

router.get('/user/:userId', getUserCollections);
router.get('/:id', getCollectionById);

// Protected routes
router.post('/', protect, createCollection);
router.post('/:id/artwork', protect, addArtworkToCollection);
router.delete('/:id/artwork/:artworkId', protect, removeArtworkFromCollection);

export default router;
