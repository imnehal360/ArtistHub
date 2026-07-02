import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../services/api.js';
import { User, Globe, Instagram, Twitter, Linkedin, Save } from 'lucide-react';

const DashboardSettings = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Files state
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // Skill tags state
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/artists/profile/${user.username}`);
        setProfile(res.data.profile);
        setSkills(res.data.profile.skills || []);

        // Prepopulate form values
        setValue('fullName', res.data.profile.fullName);
        setValue('bio', res.data.profile.bio);
        setValue('about', res.data.profile.about);
        setValue('website', res.data.profile.socialLinks?.website || '');
        setValue('instagram', res.data.profile.socialLinks?.instagram || '');
        setValue('twitter', res.data.profile.socialLinks?.twitter || '');
        setValue('linkedin', res.data.profile.socialLinks?.linkedin || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, setValue]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() !== '' && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (sToRemove) => {
    setSkills(skills.filter((s) => s !== sToRemove));
  };

  const onSubmit = async (data) => {
    setSaving(true);
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('bio', data.bio);
    formData.append('about', data.about);
    formData.append('skills', JSON.stringify(skills));
    
    const socialLinks = {
      website: data.website,
      instagram: data.instagram,
      twitter: data.twitter,
      linkedin: data.linkedin
    };
    formData.append('socialLinks', JSON.stringify(socialLinks));

    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    if (coverFile) {
      formData.append('coverImage', coverFile);
    }

    try {
      const res = await API.put('/artists/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Settings updated successfully!');
      refreshUser(res.data.profile); // Sync profile avatar state in Navbar
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin border-t-2 border-brand-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl text-left">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Profile Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure your bio details, skills, social links, and cover artwork.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Core fields card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-white/5 dark:bg-slate-900 space-y-4">
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display/Full Name</label>
              <input
                type="text"
                {...register('fullName', { required: 'Name is required' })}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none"
              />
              {errors.fullName && <span className="text-[10px] text-red-500">{errors.fullName.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Short Bio</label>
              <input
                type="text"
                {...register('bio')}
                className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none"
                placeholder="e.g. Concept artist interested in neo-cyberpunk styles"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">About (Long form description)</label>
            <textarea
              {...register('about')}
              rows="4"
              className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none"
              placeholder="Tell visitors about your journey, achievements, and experiences..."
            />
          </div>

          {/* Files Upload grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
                className="w-full text-xs text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Header Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0])}
                className="w-full text-xs text-slate-400"
              />
            </div>
          </div>

        </div>

        {/* Skills Tag input card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-white/5 dark:bg-slate-900 space-y-4">
          <h3 className="font-display text-sm font-semibold text-slate-800 dark:text-white">Skills & Focus Areas</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none"
              placeholder="e.g. Concept Art, Blender, UI Design"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs hover:bg-slate-50 dark:border-white/10 dark:hover:bg-slate-800"
            >
              Add
            </button>
          </div>
          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1"
                >
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-[8px] hover:text-red-500">x</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Social Links card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-white/5 dark:bg-slate-900 space-y-4">
          <h3 className="font-display text-sm font-semibold text-slate-800 dark:text-white">Social Media Connections</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 dark:border-white/10">
              <Globe className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                {...register('website')}
                placeholder="Portfolio website URL"
                className="bg-transparent text-xs text-slate-800 dark:text-slate-300 outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 dark:border-white/10">
              <Instagram className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                {...register('instagram')}
                placeholder="Instagram username"
                className="bg-transparent text-xs text-slate-800 dark:text-slate-300 outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 dark:border-white/10">
              <Twitter className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                {...register('twitter')}
                placeholder="Twitter username"
                className="bg-transparent text-xs text-slate-800 dark:text-slate-300 outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 dark:border-white/10">
              <Linkedin className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                {...register('linkedin')}
                placeholder="LinkedIn handle"
                className="bg-transparent text-xs text-slate-800 dark:text-slate-300 outline-none w-full"
              />
            </div>

          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand-500 px-8 py-3 text-xs font-bold text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <Save className="h-4.5 w-4.5" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default DashboardSettings;
