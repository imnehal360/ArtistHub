import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: [
        (val) => val.length > 0,
        'Artwork must have at least one image'
      ]
    },
    title: {
      type: String,
      required: [true, 'Artwork title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true
    },
    tags: {
      type: [String],
      index: true,
      default: []
    },
    medium: {
      type: String,
      default: ''
    },
    dimensions: {
      type: String,
      default: ''
    },
    creationYear: {
      type: Number,
      default: new Date().getFullYear()
    },
    price: {
      type: Number,
      default: 0
    },
    isForSale: {
      type: Boolean,
      default: false
    },
    copyrightInfo: {
      type: String,
      default: 'All Rights Reserved'
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Artwork = mongoose.model('Artwork', artworkSchema);
export default Artwork;
