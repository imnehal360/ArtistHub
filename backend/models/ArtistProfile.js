import mongoose from 'mongoose';

const artistProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    },
    coverImage: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [160, 'Bio cannot exceed 160 characters'],
      default: ''
    },
    about: {
      type: String,
      default: ''
    },
    skills: [{
      type: String
    }],
    socialLinks: {
      website: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      behance: { type: String, default: '' },
      dribbble: { type: String, default: '' },
      linkedin: { type: String, default: '' }
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

const ArtistProfile = mongoose.model('ArtistProfile', artistProfileSchema);
export default ArtistProfile;
