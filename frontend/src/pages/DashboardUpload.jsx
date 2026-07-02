import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import { Upload, X, HelpCircle } from 'lucide-react';

const DashboardUpload = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      isForSale: false,
      copyrightInfo: 'All Rights Reserved'
    }
  });

  const isForSaleChecked = watch('isForSale');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Constrain files list (max 5)
    const combinedFiles = [...images, ...files].slice(0, 5);
    setImages(combinedFiles);

    const previews = combinedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveImage = (idx) => {
    const updatedImages = images.filter((_, i) => i !== idx);
    setImages(updatedImages);

    const updatedPreviews = updatedImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(updatedPreviews);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tToRemove) => {
    setTags(tags.filter((t) => t !== tToRemove));
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      alert('Please upload at least one image.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('medium', data.medium);
    formData.append('dimensions', data.dimensions);
    formData.append('creationYear', data.creationYear);
    formData.append('isForSale', data.isForSale);
    formData.append('price', data.isForSale ? data.price : '0');
    formData.append('copyrightInfo', data.copyrightInfo);
    formData.append('tags', JSON.stringify(tags));

    images.forEach((img) => {
      formData.append('images', img);
    });

    try {
      await API.post('/artworks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Artwork published successfully!');
      navigate('/dashboard/gallery');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload artwork');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Digital Art',
    'Sketch',
    'Painting',
    'Watercolor',
    'Portrait',
    'Anime',
    'Fantasy',
    'Landscape',
    'Photography',
    'Pixel Art',
    'Character Design',
    'Sculpture'
  ];

  return (
    <div className="space-y-8 max-w-3xl text-left">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Publish New Artwork</h1>
        <p className="text-xs text-slate-400 mt-1">Upload files and add catalog specs to publish to your portfolio.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* DRAG & DROP MULTI-IMAGE AREA */}
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 dark:border-white/10 text-center bg-white dark:bg-slate-900/50">
          <Upload className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-300">Drag and drop images, or browse files</p>
          <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP, or GIF. Max 5 files. Up to 10MB each.</p>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            id="file-upload"
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="mt-4 inline-block cursor-pointer rounded-full bg-slate-100 dark:bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            Choose Files
          </label>

          {/* Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                  <img src={src} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute right-1.5 top-1.5 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* METADATA FORM BOX */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-white/5 dark:bg-slate-900 space-y-4">
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Artwork Title</label>
              <input
                type="text"
                {...register('title', { required: 'Artwork title is required' })}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none focus:border-brand-500"
                placeholder="e.g. Skyline in Neon"
              />
              {errors.title && <span className="text-[10px] text-red-500 mt-1 block">{errors.title.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none focus:border-brand-500"
              >
                <option value="">-- Choose Category --</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="text-[10px] text-red-500 mt-1 block">{errors.category.message}</span>}
            </div>

          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows="4"
              className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none focus:border-brand-500"
              placeholder="Tell a story behind this piece..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Medium</label>
              <input
                type="text"
                {...register('medium')}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none"
                placeholder="e.g. Digital, Acrylic"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Dimensions</label>
              <input
                type="text"
                {...register('dimensions')}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none"
                placeholder="e.g. 4000 x 3000 px"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Creation Year</label>
              <input
                type="number"
                {...register('creationYear')}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none"
                placeholder="e.g. 2026"
              />
            </div>
          </div>

          {/* Tags entry */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none"
                placeholder="Add tags (press enter or click add)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs hover:bg-slate-50 dark:border-white/10 dark:hover:bg-slate-800"
              >
                Add Tag
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 rounded bg-brand-500/10 px-2 py-0.5 text-[10px] font-medium text-brand-500"
                  >
                    <span>{t}</span>
                    <button type="button" onClick={() => handleRemoveTag(t)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sale details toggle */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Enable Artwork Sale</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Toggle this if you want visitors to buy this masterpiece</p>
              </div>
              <input
                type="checkbox"
                {...register('isForSale')}
                className="rounded text-brand-500 focus:ring-brand-500/20"
              />
            </div>

            {isForSaleChecked && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-100 dark:border-slate-800 flex flex-col gap-1 w-full sm:w-1/2">
                <label className="text-xs font-semibold text-slate-300">Artwork Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: isForSaleChecked ? 'Price is required for sale items' : false })}
                  className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none"
                  placeholder="0.00"
                />
                {errors.price && <span className="text-[10px] text-red-500 mt-1 block">{errors.price.message}</span>}
              </div>
            )}
          </div>

          {/* Copyright Selector */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Copyright Holder</label>
            <select
              {...register('copyrightInfo')}
              className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none"
            >
              <option value="All Rights Reserved">All Rights Reserved</option>
              <option value="Creative Commons (CC-BY)">Creative Commons Attribution (CC-BY)</option>
              <option value="Creative Commons Non-Commercial (CC-BY-NC)">CC Non-Commercial (CC-BY-NC)</option>
              <option value="Public Domain (CC0)">Public Domain / Free Use (CC0)</option>
            </select>
          </div>

        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-brand-500 px-8 py-3 text-xs font-bold text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all"
          >
            {loading ? 'Publishing...' : 'Publish Artwork'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default DashboardUpload;
