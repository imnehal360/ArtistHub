import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.log('☁️  Cloudinary credentials missing. Serving uploads locally from "/uploads" route.');
}

/**
 * Uploads a local file to Cloudinary or retains it locally as fallback.
 * @param {string} filePath - Absolute path to the local file
 * @param {string} folder - Folder name in Cloudinary (e.g., 'artworks', 'avatars')
 * @returns {Promise<string>} - The web URL (Cloudinary URL or static file route)
 */
export const uploadImage = async (filePath, folder = 'artisthub') => {
  if (!filePath) return '';

  try {
    if (isCloudinaryConfigured) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `${folder}`
      });
      // Delete local file after cloud upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return result.secure_url;
    } else {
      // Local fallback: return relative URL that express serves statically
      const filename = path.basename(filePath);
      return `/uploads/${filename}`;
    }
  } catch (error) {
    console.error('Image upload failed:', error.message);
    // Return local fallback on cloud error to avoid crashing
    const filename = path.basename(filePath);
    return `/uploads/${filename}`;
  }
};
