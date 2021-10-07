const express = require('express');
const products = require('../../api.products');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

router.post('/:idProduct/', async (req, res, next) => {
  const { idProduct } = req.params;
  const { user, punctuation, opinion, date, modified } = req.body;

  try {
    const review = new Review({
      punctuation,
      opinion,
      date,
      modified
    });

    const productFound = await Product.findById(idProduct);
    review.product = productFound;
    const userFound = await User.findOne({email: user.email});
    review.user = userFound;

    if (review) {
      const savedReview = await review.save();
      const productReview = await Product.findByIdAndUpdate(idProduct, {$addToSet: {reviews: savedReview}})
      return res.status(200).send('The review has been created successfully.');
    }
    return res.status(404).send('Error: The review has not been created.')
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('product').populate('user');
    if (reviews.length) {
      return res.status(200).send(reviews);
    }
    return res.status(404).send('Reviews not found.')
  } catch (e) {
    console.log(e);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (id) {
      const reviewModified = await Review.findByIdAndUpdate(id, req.body, {new: true});

      return res.status(200).send('The review has been successfully modified');
    }
    return res.status(404).send('Error: The review has not been modified.')
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (id) {
      const reviewDeleted = await Review.findByIdAndDelete(id);
      return res.status(200).send('The review has been successfully deleted.')
    }
    return res.status(404).send('Error: The review has not been deleted.')
  } catch (e) {
    console.log(e);
  }
})

module.exports = router;
