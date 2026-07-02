import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artwork',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate likes
likeSchema.index({ user: 1, artwork: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
export default Like;
