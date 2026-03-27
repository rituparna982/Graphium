const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Get all posts (most recent first), with optional pagination
 * @access  Public
 * @query   page (default 1), limit (default 20)
 */
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .populate('author', 'nameEncrypted avatar')
        .populate({
          path: 'originalPost',
          populate: { path: 'author', select: 'nameEncrypted avatar' }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments()
    ]);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + posts.length < total
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/posts/user/:userId
 * @desc    Get all posts by a specific user (most recent first)
 * @access  Public
 */
router.get('/user/:userId', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ author: req.params.userId })
        .populate('author', 'nameEncrypted avatar')
        .populate({
          path: 'originalPost',
          populate: { path: 'author', select: 'nameEncrypted avatar' }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments({ author: req.params.userId })
    ]);

    res.json({
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit), hasMore: skip + posts.length < total }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/posts
 * @desc    Create a post (stored in MongoDB). Supports different categories.
 * @access  Private
 */
router.post('/', authMiddleware, validate(['content']), async (req, res, next) => {
  try {
    const { content, category, target, attachment, tags, paper, dataset, event, article } = req.body;

    // Auto-generate action text based on category
    const actionMap = {
      general: 'shared an update',
      paper: 'published a paper',
      dataset: 'shared a dataset',
      question: 'asked a question',
      milestone: 'reached a milestone',
      event: 'shared an event',
      article: 'wrote an article'
    };

    const postCategory = category || 'general';

    const postData = {
      author: req.user._id,
      content,
      category: postCategory,
      action: actionMap[postCategory] || 'shared an update',
      target: target || '',
      attachment,
      tags: tags || [],
    };

    // Attach category-specific fields
    if (postCategory === 'paper' && paper) postData.paper = paper;
    if (postCategory === 'dataset' && dataset) postData.dataset = dataset;
    if (postCategory === 'event' && event) postData.event = event;
    if (postCategory === 'article' && article) postData.article = article;

    const newPost = new Post(postData);
    const savedPost = await newPost.save();
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
 * @route   POST /api/posts/:id/share
 * @desc    Share/Repost a post. Creates a new repost referencing the original.
 * @access  Private
 */
router.post('/:id/share', authMiddleware, async (req, res, next) => {
  try {
    const originalPost = await Post.findById(req.params.id);
    if (!originalPost) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      throw err;
    }

    const { content } = req.body;

    // Create a repost
    const repost = new Post({
      author: req.user._id,
      content: content || '',
      category: originalPost.category,
      action: 'shared a post',
      isRepost: true,
      originalPost: originalPost._id,
    });

    const savedRepost = await repost.save();
    
    // Increment share counter on original
    originalPost.shares += 1;
    await originalPost.save();

    await savedRepost.populate('author', 'nameEncrypted avatar');
    await savedRepost.populate({
      path: 'originalPost',
      populate: { path: 'author', select: 'nameEncrypted avatar' }
    });
    
    res.status(201).json(savedRepost);
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
 * @route   POST /api/posts/comment/:commentId/like
 * @desc    Toggle like on a comment
 * @access  Private
 */
router.post('/comment/:commentId/like', authMiddleware, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      const err = new Error('Comment not found');
      err.statusCode = 404;
      throw err;
    }

    const userId = req.user._id;
    const index = comment.likedBy.indexOf(userId);

    if (index === -1) {
      // Like
      comment.likedBy.push(userId);
      comment.likes += 1;
    } else {
      // Unlike
      comment.likedBy.splice(index, 1);
      comment.likes -= 1;
    }

    await comment.save();
    res.json({ likes: comment.likes, isLiked: index === -1 });
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
