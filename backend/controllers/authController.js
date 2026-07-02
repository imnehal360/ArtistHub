import User from '../models/User.js';
import ArtistProfile from '../models/ArtistProfile.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../services/email.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user & profile
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { username, email, password, role, fullName } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Set role
    const assignedRole = ['visitor', 'artist'].includes(role) ? role : 'visitor';

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create User
    const user = await User.create({
      username,
      email,
      password,
      role: assignedRole,
      verificationToken
    });

    // If registering as artist, create profile
    if (assignedRole === 'artist') {
      await ArtistProfile.create({
        user: user._id,
        fullName: fullName || username,
        bio: '',
        about: ''
      });
    }

    // Build Verification Link
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

    // Send Mail
    const emailOptions = {
      email: user.email,
      subject: 'Verify your ArtistHub Account',
      message: `Welcome to ArtistHub, @${user.username}! Please verify your email by clicking the link: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; max-width: 600px; color: #333;">
          <h2 style="color: #6366f1;">Welcome to ArtistHub!</h2>
          <p>Hi @${user.username},</p>
          <p>Thank you for signing up. Please click the button below to verify your email address and activate your account:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px; margin-bottom: 20px;">Verify Email</a>
          <p>If the button doesn't work, copy and paste this link in your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin-top: 20px;" />
          <p style="font-size: 12px; color: #888;">If you did not sign up for this account, you can ignore this email.</p>
        </div>
      `
    };

    await sendEmail(emailOptions);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email (and server logs) to verify your account.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify email token
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email successfully verified! You can now log in.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email address to log in.',
        isUnverified: true
      });
    }

    let artistProfile = null;
    if (user.role === 'artist') {
      artistProfile = await ArtistProfile.findOne({ user: user._id });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: artistProfile,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password - request token
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user registered with that email address' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const emailOptions = {
      email: user.email,
      subject: 'Reset your ArtistHub Password',
      message: `You requested a password reset. Please click this link to reset it: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; max-width: 600px; color: #333;">
          <h2 style="color: #6366f1;">Reset your Password</h2>
          <p>Hi @${user.username},</p>
          <p>You requested a password reset. Please click the button below to update your password (valid for 1 hour):</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px; margin-bottom: 20px;">Reset Password</a>
          <p>If you did not request this, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin-top: 20px;" />
          <p style="font-size: 12px; color: #888;">ArtistHub Admin Team</p>
        </div>
      `
    };

    await sendEmail(emailOptions);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email (and logged in the server console).'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset password token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
