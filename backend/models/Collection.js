import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    artworks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artwork'
    }],
    isPrivate: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Unique collection names per user
collectionSchema.index({ user: 1, name: 1 }, { unique: true });

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
