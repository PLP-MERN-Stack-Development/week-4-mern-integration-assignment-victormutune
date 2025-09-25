
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const Post = require('../models/Post');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });
// POST /api/posts/upload-image
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// GET /api/posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find().populate('category').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('category');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// POST /api/posts
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required')
  ],
  async (req, res, next) => {
    try {
      const errors = require('express-validator').validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const post = new Post(req.body);
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/posts/:id
router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('title').optional().notEmpty(),
    body('content').optional().notEmpty(),
    body('category').optional().notEmpty()
  ],
  async (req, res, next) => {
    try {
      const errors = require('express-validator').validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.json(post);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/posts/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
