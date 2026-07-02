import Collection from '../models/Collection.js';
import Artwork from '../models/Artwork.js';
import ArtistProfile from '../models/ArtistProfile.js';

// @desc    Create a collection
// @route   POST /api/collections
// @access  Private
export const createCollection = async (req, res) => {
  const { name, description, isPrivate } = req.body;

  try {
    const exists = await Collection.findOne({ user: req.user._id, name });
    if (exists) {
      return res.status(400).json({ message: 'You already have a collection with this name' });
    }

    const collection = await Collection.create({
      user: req.user._id,
      name,
      description,
      isPrivate: isPrivate === 'true' || isPrivate === true
    });

    res.status(201).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add artwork to collection
// @route   POST /api/collections/:id/artwork
// @access  Private
export const addArtworkToCollection = async (req, res) => {
  const { artworkId } = req.body;

  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Ownership check
    if (collection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this collection' });
    }

    const artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    if (collection.artworks.includes(artworkId)) {
      return res.status(400).json({ message: 'Artwork already in collection' });
    }

    collection.artworks.push(artworkId);
    await collection.save();

    res.status(200).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove artwork from collection
// @route   DELETE /api/collections/:id/artwork/:artworkId
// @access  Private
export const removeArtworkFromCollection = async (req, res) => {
  const { id, artworkId } = req.params;

  try {
    const collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Ownership check
    if (collection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this collection' });
    }

    collection.artworks = collection.artworks.filter(
      (art) => art.toString() !== artworkId.toString()
    );
    await collection.save();

    res.status(200).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's collections
// @route   GET /api/collections/user/:userId
// @access  Public (Hides private collections unless request user is owner)
export const getUserCollections = async (req, res) => {
  const { userId } = req.params;
  const reqUserId = req.query.userId;

  try {
    const isOwner = reqUserId && reqUserId.toString() === userId.toString();
    const query = { user: userId };
    
    // Hide private collections if request user is not owner
    if (!isOwner) {
      query.isPrivate = false;
    }

    const collections = await Collection.find(query).populate({
      path: 'artworks',
      select: 'title images'
    });
    
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single collection details
// @route   GET /api/collections/:id
// @access  Public (Enforces private check)
export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('user', 'username')
      .populate('artworks');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (collection.isPrivate) {
      const authUserId = req.query.userId;
      if (!authUserId || authUserId.toString() !== collection.user._id.toString()) {
        return res.status(403).json({ message: 'This collection is private' });
      }
    }

    // Populate artists of the artworks in the collection
    const artworksWithArtists = await Promise.all(
      collection.artworks.map(async (art) => {
        const artistUser = await User.findById(art.artist).select('username');
        const artistProfile = await ArtistProfile.findOne({ user: art.artist }).select('avatar fullName');
        return {
          ...art.toObject(),
          artist: artistUser,
          artistProfile
        };
      })
    );

    res.status(200).json({
      ...collection.toObject(),
      artworks: artworksWithArtists
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
