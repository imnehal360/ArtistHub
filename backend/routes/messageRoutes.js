import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  sendMessage,
  getConversations,
  getMessages,
  markRead
} from '../controllers/messageController.js';

const router = express.Router();

// All message routes are protected
router.use(protect);

router.post('/', upload.single('image'), sendMessage);
router.get('/conversations', getConversations);
router.get('/thread/:contactId', getMessages);
router.put('/read/:contactId', markRead);

export default router;
