import Artwork from '../models/Artwork.js';
import Like from '../models/Like.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import ArtistProfile from '../models/ArtistProfile.js';
import { uploadImage } from '../services/cloudinary.js';

// @desc    Upload new artwork
// @route   POST /api/artworks
// @access  Private (Artist/Admin)
export const uploadArtwork = async (req, res) => {
  const {
    title,
    description,
    category,
    tags,
    medium,
    dimensions,
    creationYear,
    price,
    isForSale,
    copyrightInfo
  } = req.body;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Upload files to storage (Cloudinary or local static fallback)
    const uploadedImages = [];
    for (const file of req.files) {
      const url = await uploadImage(file.path, 'artworks');
      uploadedImages.push(url);
    }

    // Parse tags if passed as JSON string or string
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [];
      }
    }

    const artwork = await Artwork.create({
      artist: req.user._id,
      images: uploadedImages,
      title,
      description,
      category,
      tags: parsedTags,
      medium,
      dimensions,
      creationYear: creationYear ? parseInt(creationYear) : undefined,
      price: price ? parseFloat(price) : 0,
      isForSale: isForSale === 'true' || isForSale === true,
      copyrightInfo
    });

    res.status(201).json({ success: true, artwork });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get artworks (Filters, search, sorting, pagination)
// @route   GET /api/artworks
// @access  Public
export const getArtworks = async (req, res) => {
  const { category, tag, isForSale, search, sortBy, page = 1, limit = 12 } = req.query;

  try {
    const query = {};

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (isForSale === 'true') {
      query.isForSale = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default: latest
    if (sortBy === 'trending') {
      sortOptions = { views: -1, createdAt: -1 };
    } else if (sortBy === 'most-viewed') {
      sortOptions = { views: -1 };
    } else if (sortBy === 'most-liked') {
      // Handled via aggregations or simply sorting by views since likes count isn't stored as a single number field
      // We can update likes sorting to sort by views or a fallback for simple MERN.
      // Let's sort by views or another metric, or we can aggregate likes if needed, but views is standard.
      sortOptions = { views: -1 };
    }

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);

    const artworks = await Artwork.find(query)
      .populate('artist', 'username')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skipIndex);

    // Populate artist profile picture/fullname
    const populatedArtworks = await Promise.all(
      artworks.map(async (art) => {
        const profile = await ArtistProfile.findOne({ user: art.artist?._id });
        const likesCount = await Like.countDocuments({ artwork: art._id });
        return {
          ...art.toObject(),
          artistProfile: profile,
          likesCount
        };
      })
    );

    const total = await Artwork.countDocuments(query);

    res.status(200).json({
      artworks: populatedArtworks,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalArtworks: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single artwork by ID
// @route   GET /api/artworks/:id
// @access  Public
export const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate('artist', 'username email');
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Increment views
    artwork.views += 1;
    await artwork.save();

    const artistProfile = await ArtistProfile.findOne({ user: artwork.artist?._id });
    const likesCount = await Like.countDocuments({ artwork: artwork._id });
    
    // Check if current user likes this artwork
    let isLiked = false;
    if (req.query.userId) {
      const like = await Like.findOne({ user: req.query.userId, artwork: artwork._id });
      isLiked = !!like;
    }

    res.status(200).json({
      ...artwork.toObject(),
      artistProfile,
      likesCount,
      isLiked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle artwork like
// @route   POST /api/artworks/:id/like
// @access  Private
export const toggleLikeArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    const alreadyLiked = await Like.findOne({ user: req.user._id, artwork: artwork._id });

    if (alreadyLiked) {
      await Like.deleteOne({ _id: alreadyLiked._id });
      res.status(200).json({ liked: false, message: 'Artwork unliked' });
    } else {
      await Like.create({ user: req.user._id, artwork: artwork._id });

      // Create notification for the artist if it's not their own artwork
      if (artwork.artist.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: artwork.artist,
          sender: req.user._id,
          type: 'like',
          artwork: artwork._id
        });
      }

      res.status(201).json({ liked: true, message: 'Artwork liked' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete artwork
// @route   DELETE /api/artworks/:id
// @access  Private (Artist/Admin)
export const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Check ownership
    if (artwork.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this artwork' });
    }

    await Artwork.deleteOne({ _id: artwork._id });
    // Also clean up likes and comments
    await Like.deleteMany({ artwork: artwork._id });

    res.status(200).json({ success: true, message: 'Artwork deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instant search suggestions
// @route   GET /api/artworks/search/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') {
    return res.status(200).json([]);
  }

  try {
    const artworks = await Artwork.find({
      title: { $regex: q, $options: 'i' }
    })
      .select('title category')
      .limit(5);

    const artists = await User.find({
      role: 'artist',
      username: { $regex: q, $options: 'i' }
    })
      .select('username')
      .limit(3);

    const suggestions = [
      ...artworks.map(a => ({ text: a.title, type: 'artwork', id: a._id })),
      ...artists.map(a => ({ text: `@${a.username}`, type: 'artist', username: a.username }))
    ];

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related artworks by category
// @route   GET /api/artworks/:id/related
// @access  Public
export const getRelatedArtworks = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    const related = await Artwork.find({
      category: artwork.category,
      _id: { $ne: artwork._id }
    })
      .populate('artist', 'username')
      .limit(4);

    const populatedRelated = await Promise.all(
      related.map(async (art) => {
        const profile = await ArtistProfile.findOne({ user: art.artist?._id });
        const likesCount = await Like.countDocuments({ artwork: art._id });
        return {
          ...art.toObject(),
          artistProfile: profile,
          likesCount
        };
      })
    );

    res.status(200).json(populatedRelated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
