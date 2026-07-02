import User from '../models/User.js';
import Artwork from '../models/Artwork.js';
import ArtistProfile from '../models/ArtistProfile.js';
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';

// @desc    Get dashboard metrics for administration
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalArtists = await User.countDocuments({ role: 'artist' });
    const totalArtworks = await Artwork.countDocuments();
    const totalLikes = await Like.countDocuments();

    // Aggregate artwork views
    const viewsAggregate = await Artwork.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewsAggregate[0]?.totalViews || 0;

    // Last 5 registered users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Categories breakdown
    const categoryStats = await Artwork.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      stats: {
        totalUsers,
        totalArtists,
        totalArtworks,
        totalLikes,
        totalViews
      },
      recentUsers,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsersList = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    
    const enrichedUsers = await Promise.all(
      users.map(async (u) => {
        const profile = await ArtistProfile.findOne({ user: u._id }).select('fullName avatar');
        return {
          ...u,
          profile
        };
      })
    );

    res.status(200).json(enrichedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!['visitor', 'artist', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role assignment' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Protect super-admin from changing own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    const previousRole = user.role;
    user.role = role;
    await user.save();

    // If upgraded to artist, ensure profile exists
    if (role === 'artist' && previousRole !== 'artist') {
      const profileExists = await ArtistProfile.findOne({ user: user._id });
      if (!profileExists) {
        await ArtistProfile.create({
          user: user._id,
          fullName: user.username,
          bio: '',
          about: ''
        });
      }
    }

    res.status(200).json({ success: true, message: `User role updated to ${role}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account and all profiles/assets
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    // Delete related records
    await User.deleteOne({ _id: user._id });
    await ArtistProfile.deleteOne({ user: user._id });
    await Artwork.deleteMany({ artist: user._id });
    await Like.deleteMany({ user: user._id });
    await Comment.deleteMany({ user: user._id });

    res.status(200).json({ success: true, message: 'User and all related records deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
