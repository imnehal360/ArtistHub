import Message from '../models/Message.js';
import User from '../models/User.js';
import ArtistProfile from '../models/ArtistProfile.js';
import Notification from '../models/Notification.js';
import { uploadImage } from '../services/cloudinary.js';

// @desc    Send private message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  const { recipientId, text, emoji } = req.body;

  try {
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadImage(req.file.path, 'messages');
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      text,
      image: imageUrl,
      emoji
    });

    const populatedMsg = await Message.findById(message._id)
      .populate('sender', 'username')
      .populate('recipient', 'username');

    // Create message notification
    await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type: 'message',
      message: message._id
    });

    res.status(201).json({ success: true, message: populatedMsg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active conversations list
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  const userId = req.user._id;

  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);

    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const contactUser = await User.findById(conv._id).select('username role');
        const contactProfile = await ArtistProfile.findOne({ user: conv._id }).select('avatar fullName');

        // Unread messages count sent by this contact
        const unreadCount = await Message.countDocuments({
          sender: conv._id,
          recipient: userId,
          isRead: false
        });

        return {
          contact: {
            _id: contactUser?._id,
            username: contactUser?.username,
            role: contactUser?.role,
            fullName: contactProfile?.fullName || contactUser?.username,
            avatar: contactProfile?.avatar || ''
          },
          lastMessage: conv.lastMessage,
          unreadCount
        };
      })
    );

    // Sort by last message date desc
    enrichedConversations.sort(
      (a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );

    res.status(200).json(enrichedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages thread with a specific user
// @route   GET /api/messages/thread/:contactId
// @access  Private
export const getMessages = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: contactId },
        { sender: contactId, recipient: userId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username')
      .populate('recipient', 'username');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark conversation as read
// @route   PUT /api/messages/read/:contactId
// @access  Private
export const markRead = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  try {
    await Message.updateMany(
      { sender: contactId, recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    // Mark corresponding notification read
    await Notification.updateMany(
      { sender: contactId, recipient: userId, type: 'message', isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
