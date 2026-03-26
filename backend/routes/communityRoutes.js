const express = require('express');
const Community = require('../models/Community');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/community
 * @desc    Get all communities
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const communities = await Community.find().populate('members', 'name avatar');
    res.json(communities);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/community/:id/join
 * @desc    Join a community
 * @access  Private
 */
router.post('/:id/join', authMiddleware, async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      const err = new Error('Community not found');
      err.statusCode = 404;
      throw err;
    }

    if (community.members.includes(req.user._id)) {
      const err = new Error('Already a member');
      err.statusCode = 400;
      throw err;
    }

    community.members.push(req.user._id);
    await community.save();
    res.json({ message: 'Joined successfully', community });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
