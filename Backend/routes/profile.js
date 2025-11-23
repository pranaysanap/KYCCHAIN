import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import User from "../models/user.js";
import UserDocument from "../models/UserDocument.js";
import Consent from "../models/Consent.js";
import cloudinary from "../cloudinary.js";

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build profile payload from saved user data
    const profile = {
      user: {
        id: user._id,
        fullName: user.fullName,
        profileImage: user.profileImage || null,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.accountType === 'Individual User' ? 'user' : 'bank',
        twoFactorEnabled: !!user.twoFactorEnabled,
      },
      security: {
        twoFactorEnabled: !!user.twoFactorEnabled,
        sessions: [
          {
            id: 'sess-1',
            device: 'Chrome on Windows',
            location: 'Current Location',
            ip: req.ip || '127.0.0.1',
            lastActive: new Date().toISOString(),
          },
        ],
      },
      preferences: {
        theme: 'dark',
        emailAlerts: true,
        fraudAlerts: true,
        language: 'en',
      },
      activity: [
        {
          id: 'act-1',
          timestamp: new Date().toISOString(),
          action: 'Profile viewed',
          status: 'success',
          ip: req.ip || '127.0.0.1',
        },
      ],
    };

    res.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, email, phone, address } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

  // Update fields
  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (req.body.twoFactorEnabled !== undefined) user.twoFactorEnabled = !!req.body.twoFactorEnabled;

    await user.save();

    res.json({
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.accountType === 'Individual User' ? 'user' : 'bank',
        twoFactorEnabled: !!user.twoFactorEnabled,
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Update preferences (mock implementation)
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { theme, emailAlerts, fraudAlerts, language } = req.body;

    // In a real app, you'd save this to a preferences table
    const preferences = {
      theme: theme || 'dark',
      emailAlerts: emailAlerts !== undefined ? emailAlerts : true,
      fraudAlerts: fraudAlerts !== undefined ? fraudAlerts : true,
      language: language || 'en'
    };

    res.json(preferences);
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Delete user account
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all user documents to delete from Cloudinary
    const userDocuments = await UserDocument.find({ email: user.email });

    // Delete files from Cloudinary
    for (const doc of userDocuments) {
      try {
        await cloudinary.uploader.destroy(doc.public_id, { resource_type: 'raw' });
      } catch (cloudinaryError) {
        console.error(`Failed to delete file ${doc.public_id} from Cloudinary:`, cloudinaryError);
        // Continue with other deletions even if one fails
      }
    }

    // Delete the entire user folder from Cloudinary
    try {
      await cloudinary.api.delete_folder(user.email);
    } catch (folderError) {
      console.error(`Failed to delete folder ${user.email} from Cloudinary:`, folderError);
      // Continue with database deletions even if folder deletion fails
    }

    // Delete associated consents from database
    await Consent.deleteMany({ userId: req.user.userId });

    // Delete associated documents from database
    await UserDocument.deleteMany({ email: user.email });

    // Delete the user
    await User.findByIdAndDelete(req.user.userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;

// POST /profile/avatar - upload profile avatar image
// Uses multer to accept multipart/form-data; saves file to Cloudinary and updates User.profileImage
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    cb(null, tempDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for avatars
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported avatar file type'));
  },
});

router.post('/avatar', authenticateToken, avatarUpload.single('avatar'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Upload to Cloudinary under user's folder
    const folder = `${user.email}/avatar`;
    const result = await cloudinary.uploader.upload(file.path, { folder, resource_type: 'image' });

    // Save to user
    user.profileImage = result.secure_url;
    user.profileImagePublicId = result.public_id;
    await user.save();

    // Remove temp file
    try { fs.unlinkSync(file.path); } catch (e) { console.warn('Failed to unlink temp avatar file', e && e.message ? e.message : e); }

    res.json({ message: 'Avatar uploaded', profileImage: user.profileImage });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ error: err.message || 'Avatar upload failed' });
  }
});
