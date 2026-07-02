import ArtistProfile from '../models/ArtistProfile.js';
import User from '../models/User.js';
import Artwork from '../models/Artwork.js';
import Follow from '../models/Follow.js';
import Like from '../models/Like.js';
import Notification from '../models/Notification.js';
import Collection from '../models/Collection.js';
import { uploadImage } from '../services/cloudinary.js';

// @desc    Get public artist profile by username
// @route   GET /api/artists/:username
// @access  Public
export const getArtistProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username, role: 'artist' });
    if (!user) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const profile = await ArtistProfile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile details not found' });
    }

    // Increment profile views
    profile.views += 1;
    await profile.save();

    // Get artist's artworks
    const artworks = await Artwork.find({ artist: user._id }).sort({ createdAt: -1 });

    // Populate likes count for each artwork
    const artworksWithLikes = await Promise.all(
      artworks.map(async (art) => {
        const likesCount = await Like.countDocuments({ artwork: art._id });
        return { ...art.toObject(), likesCount };
      })
    );

    // Get public collections
    const collections = await Collection.find({ user: user._id, isPrivate: false })
      .populate('artworks');

    // Get follower/following counts
    const followersCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });

    // Get total likes across all artworks
    const artworkIds = artworks.map(a => a._id);
    const totalLikes = await Like.countDocuments({ artwork: { $in: artworkIds } });

    // Check if the current requesting user is following this artist
    let isFollowing = false;
    if (req.query.userId) {
      const follow = await Follow.findOne({ follower: req.query.userId, following: user._id });
      isFollowing = !!follow;
    }

    res.status(200).json({
      profile: {
        ...profile.toObject(),
        username: user.username,
        email: user.email,
        followersCount,
        followingCount,
        totalLikes,
        artworks: artworksWithLikes,
        collections
      },
      isFollowing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update artist profile (avatar, cover, bio, socials)
// @route   PUT /api/artists/profile
// @access  Private (Artist)
export const updateArtistProfile = async (req, res) => {
  const { fullName, bio, about, skills, socialLinks } = req.body;

  try {
    const profile = await ArtistProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Handle avatar and cover files if present
    if (req.files) {
      if (req.files.avatar && req.files.avatar[0]) {
        profile.avatar = await uploadImage(req.files.avatar[0].path, 'avatars');
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        profile.coverImage = await uploadImage(req.files.coverImage[0].path, 'covers');
      }
    }

    if (fullName) profile.fullName = fullName;
    if (bio !== undefined) profile.bio = bio;
    if (about !== undefined) profile.about = about;

    if (skills) {
      profile.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    }

    if (socialLinks) {
      const parsedSocials = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
      profile.socialLinks = { ...profile.socialLinks, ...parsedSocials };
    }

    await profile.save();

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle follow artist
// @route   POST /api/artists/:id/follow
// @access  Private
export const toggleFollowArtist = async (req, res) => {
  const artistId = req.params.id;

  try {
    if (artistId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const artistExists = await User.findById(artistId);
    if (!artistExists || artistExists.role !== 'artist') {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const alreadyFollowing = await Follow.findOne({
      follower: req.user._id,
      following: artistId
    });

    if (alreadyFollowing) {
      await Follow.deleteOne({ _id: alreadyFollowing._id });
      res.status(200).json({ following: false, message: 'Unfollowed artist' });
    } else {
      await Follow.create({
        follower: req.user._id,
        following: artistId
      });

      // Create notification
      await Notification.create({
        recipient: artistId,
        sender: req.user._id,
        type: 'follow'
      });

      res.status(201).json({ following: true, message: 'Followed artist' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending/popular artists
// @route   GET /api/artists/trending/list
// @access  Public
export const getTrendingArtists = async (req, res) => {
  try {
    // Get profiles with most views
    const profiles = await ArtistProfile.find()
      .populate('user', 'username')
      .sort({ views: -1 })
      .limit(6);

    const enrichedProfiles = await Promise.all(
      profiles.map(async (p) => {
        const followersCount = await Follow.countDocuments({ following: p.user?._id });
        const artworksCount = await Artwork.countDocuments({ artist: p.user?._id });
        return {
          ...p.toObject(),
          followersCount,
          artworksCount
        };
      })
    );

    res.status(200).json(enrichedProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics for dashboard
// @route   GET /api/artists/dashboard/analytics
// @access  Private (Artist)
export const getArtistAnalytics = async (req, res) => {
  try {
    const artistId = req.user._id;

    // Basic Metrics
    const artworks = await Artwork.find({ artist: artistId });
    const artworkIds = artworks.map(a => a._id);

    const totalArtworks = artworks.length;

    // Total Views
    const totalArtworkViews = artworks.reduce((sum, art) => sum + art.views, 0);
    const profile = await ArtistProfile.findOne({ user: artistId });
    const profileViews = profile ? profile.views : 0;
    const totalViews = totalArtworkViews + profileViews;

    // Total Followers
    const totalFollowers = await Follow.countDocuments({ following: artistId });

    // Total Likes
    const totalLikes = await Like.countDocuments({ artwork: { $in: artworkIds } });

    // Popular Artworks
    const popularArtworks = await Artwork.find({ artist: artistId })
      .sort({ views: -1 })
      .limit(3);

    const popularWithLikes = await Promise.all(
      popularArtworks.map(async (art) => {
        const likesCount = await Like.countDocuments({ artwork: art._id });
        return {
          ...art.toObject(),
          likesCount
        };
      })
    );

    // Mock analytical graph data (for rendering nice premium Recharts frontend graphs)
    const viewsHistory = [
      { date: 'Mon', views: Math.round(totalViews * 0.1) },
      { date: 'Tue', views: Math.round(totalViews * 0.15) },
      { date: 'Wed', views: Math.round(totalViews * 0.12) },
      { date: 'Thu', views: Math.round(totalViews * 0.2) },
      { date: 'Fri', views: Math.round(totalViews * 0.18) },
      { date: 'Sat', views: Math.round(totalViews * 0.25) },
      { date: 'Sun', views: Math.round(totalViews * 0.3) }
    ];

    const followersGrowth = [
      { month: 'Jan', followers: Math.max(0, totalFollowers - 10) },
      { month: 'Feb', followers: Math.max(0, totalFollowers - 8) },
      { month: 'Mar', followers: Math.max(0, totalFollowers - 5) },
      { month: 'Apr', followers: Math.max(0, totalFollowers - 3) },
      { month: 'May', followers: totalFollowers }
    ];

    const trafficSources = [
      { name: 'Search', value: 40 },
      { name: 'Direct', value: 25 },
      { name: 'Social Media', value: 20 },
      { name: 'Referral', value: 15 }
    ];

    res.status(200).json({
      metrics: {
        totalArtworks,
        totalViews,
        totalFollowers,
        totalLikes,
        profileViews
      },
      popularArtworks: popularWithLikes,
      viewsHistory,
      followersGrowth,
      trafficSources
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
