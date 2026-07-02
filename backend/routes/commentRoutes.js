import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  addComment,
  getCommentsByArtwork,
  deleteComment
} from '../controllers/commentController.js';

const router = express.Router();

router.get('/artwork/:artworkId', getCommentsByArtwork);

// Protected routes
router.post('/', protect, addComment);
router.delete('/:id', protect, deleteComment);

export default router;
