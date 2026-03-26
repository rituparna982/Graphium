const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Get all posts
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'nameEncrypted avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/posts
 * @desc    Create a post
 * @access  Private
 */
router.post('/', authMiddleware, validate(['content']), async (req, res, next) => {
  try {
    const { content, action, target, attachment } = req.body;

    const newPost = new Post({
      author: req.user._id,
      content,
      action: action || 'shared an update',
      target,
      attachment
    });

    const savedPost = await newPost.save();
    // Populate author before returning
    await savedPost.populate('author', 'nameEncrypted avatar');
    
    res.status(201).json(savedPost);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post
 * @access  Private (Owner only)
 */
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      throw err;
    }

    if (post.author.toString() !== req.user._id.toString()) {
      const err = new Error('Not authorized to edit this post');
      err.statusCode = 403;
      throw err;
    }

    const { content, attachment } = req.body;
    if (content) post.content = content;
    if (attachment) post.attachment = attachment;

    const updatedPost = await post.save();
    await updatedPost.populate('author', 'nameEncrypted avatar');
    res.json(updatedPost);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post
 * @access  Private (Owner only)
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      throw err;
    }

    if (post.author.toString() !== req.user._id.toString()) {
      const err = new Error('Not authorized to delete this post');
      err.statusCode = 403;
      throw err;
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/posts/:id/like
 * @desc    Toggle like on a post
 * @access  Private
 */
router.post('/:id/like', authMiddleware, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      throw err;
    }

    const userId = req.user._id;
    const index = post.likedBy.indexOf(userId);

    if (index === -1) {
      // Like
      post.likedBy.push(userId);
      post.likes += 1;
    } else {
      // Unlike
      post.likedBy.splice(index, 1);
      post.likes -= 1;
    }

    await post.save();
    res.json({ likes: post.likes, isLiked: index === -1 });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/posts/:id/comments
 * @desc    Get comments for a post
 * @access  Public
 */
router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'nameEncrypted avatar')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/posts/:id/comment
 * @desc    Add a comment to a post
 * @access  Private
 */
router.post('/:id/comment', authMiddleware, validate(['content']), async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      throw err;
    }

    const { content } = req.body;
    const newComment = new Comment({
      post: req.params.id,
      author: req.user._id,
      content
    });

    const savedComment = await newComment.save();
    
    // Increment comments counter
    post.comments += 1;
    await post.save();

    await savedComment.populate('author', 'nameEncrypted avatar');
    res.status(201).json(savedComment);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/posts/:id/save
 * @desc    Toggle save on a post
 * @access  Private
 */
router.post('/:id/save', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      throw err;
    }

    const index = user.savedPosts.indexOf(postId);
    if (index === -1) {
      // Save
      user.savedPosts.push(postId);
    } else {
      // Unsave
      user.savedPosts.splice(index, 1);
    }

    await user.save();
    res.json({ isSaved: index === -1, savedPosts: user.savedPosts });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
