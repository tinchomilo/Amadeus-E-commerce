const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    /* id, */
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    categories: [{
        ref: "Category",
        type: Schema.Types.ObjectId
    }],
    reviews: [{
      ref: "Review",
      type: Schema.Types.ObjectId
    }]
    //compradores: [{}],
},
{
    timestamps: false,
    versionKey: false,
  }
)

const Product = model('Product', productSchema)

module.exports = Product
