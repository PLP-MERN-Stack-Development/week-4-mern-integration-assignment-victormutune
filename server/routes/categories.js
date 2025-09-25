const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Category = require('../models/Category');

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// POST /api/categories
router.post(
  '/',
  [body('name').notEmpty().withMessage('Name is required')],
  async (req, res, next) => {
    try {
      const errors = require('express-validator').validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const category = new Category(req.body);
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
