const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
  product: {
    ref: 'Product',
    type: Schema.Types.ObjectId,
  },
  user: {
    ref: "User",
    type: Schema.Types.ObjectId
  },
  punctuation: Number,
  opinion: String,
  date: String,
  modified: String
  },
  {
  timestamps: false,
  versionKey: false,
})

const Review = model('Review', reviewSchema)

module.exports = Review
