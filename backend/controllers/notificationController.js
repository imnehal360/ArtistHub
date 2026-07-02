import Notification from '../models/Notification.js';
import ArtistProfile from '../models/ArtistProfile.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'username')
      .populate('artwork', 'title images')
      .populate('message', 'text')
      .sort({ createdAt: -1 })
      .lean();

    const enrichedNotifications = await Promise.all(
      notifications.map(async (n) => {
        const senderProfile = await ArtistProfile.findOne({ user: n.sender?._id }).select('avatar fullName');
        return {
          ...n,
          senderProfile
        };
      })
    );

    res.status(200).json(enrichedNotifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read
// @access  Private
export const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
