const express = require('express');
const Profile = require('../models/Profile');
const { authMiddleware } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * @route   GET /api/profile
 * @desc    Get current user's profile or a specific profile
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res, next) => {
  // Handle / profile (current user)
  try {
    const profile = await Profile.findOne({ userId: req.user._id }).populate('userId', 'name email avatar');
    if (!profile) {
      const err = new Error('Profile not found');
      err.statusCode = 404;
      throw err;
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

router.get('/:userId', async (req, res, next) => {
  // Handle /:userId profile
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate('userId', 'name email avatar');
    if (!profile) {
      const err = new Error('Profile not found');
      err.statusCode = 404;
      throw err;
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Create or update user profile
 * @access  Private
 */
router.put('/', authMiddleware, validate(['title', 'institution']), async (req, res, next) => {
  try {
    const { title, institution, about, stats, publications, grants, skills } = req.body;

    const profileFields = {
      userId: req.user._id,
      name: req.user.name, // Take name from User model
      avatar: req.user.avatar,
      title,
      institution,
      about,
      stats,
      publications,
      grants,
      skills
    };

    let profile = await Profile.findOne({ userId: req.user._id });
    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
