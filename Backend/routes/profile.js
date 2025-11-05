import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

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

    // Mock profile data (in real app, you'd have a separate Profile model)
    const profile = {
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.accountType === 'Individual User' ? 'user' : 'bank'
      },
      security: {
        twoFactorEnabled: false,
        sessions: [
          {
            id: 'sess-1',
            device: 'Chrome on Windows',
            location: 'Current Location',
            ip: req.ip || '127.0.0.1',
            lastActive: new Date().toISOString()
          }
        ]
      },
      preferences: {
        theme: 'dark',
        emailAlerts: true,
        fraudAlerts: true,
        language: 'en'
      },
      activity: [
        {
          id: 'act-1',
          timestamp: new Date().toISOString(),
          action: 'Profile viewed',
          status: 'success',
          ip: req.ip || '127.0.0.1'
        }
      ]
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

    await user.save();

    res.json({
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.accountType === 'Individual User' ? 'user' : 'bank'
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

export default router;
