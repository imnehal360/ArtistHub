import Comment from '../models/Comment.js';
import Artwork from '../models/Artwork.js';
import Notification from '../models/Notification.js';
import ArtistProfile from '../models/ArtistProfile.js';

// @desc    Add comment on an artwork
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res) => {
  const { artworkId, content, parentCommentId } = req.body;

  try {
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    const comment = await Comment.create({
      artwork: artworkId,
      user: req.user._id,
      content,
      parentComment: parentCommentId || null
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username')
      .lean();

    // Populate user profile info (avatar)
    const profile = await ArtistProfile.findOne({ user: req.user._id }).select('avatar fullName');
    populatedComment.userProfile = profile;

    // Notify artwork artist (if not self commenting)
    if (artwork.artist.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: artwork.artist,
        sender: req.user._id,
        type: 'comment',
        artwork: artworkId
      });
    }

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments for an artwork
// @route   GET /api/comments/artwork/:artworkId
// @access  Public
export const getCommentsByArtwork = async (req, res) => {
  try {
    const comments = await Comment.find({ artwork: req.params.artworkId })
      .populate('user', 'username')
      .sort({ createdAt: 1 })
      .lean();

    // Populate profile details for all commenters
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        const profile = await ArtistProfile.findOne({ user: comment.user?._id }).select('avatar fullName');
        return {
          ...comment,
          userProfile: profile
        };
      })
    );

    res.status(200).json(enrichedComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check authorization: commenter or artwork artist or admin can delete
    const artwork = await Artwork.findById(comment.artwork);
    const isOwner = comment.user.toString() === req.user._id.toString();
    const isArtist = artwork && artwork.artist.toString() === req.user._id.toString();

    if (!isOwner && !isArtist && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Delete comment and all its nested replies
    await Comment.deleteMany({
      $or: [{ _id: comment._id }, { parentComment: comment._id }]
    });

    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
