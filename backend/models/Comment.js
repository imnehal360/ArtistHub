import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artwork',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Comment content cannot be empty'],
      trim: true
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
