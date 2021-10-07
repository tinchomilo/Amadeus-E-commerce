const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    buyer: {
        ref: "User",
        type: Schema.Types.ObjectId,
        required: false
    },
    phone: {
        type: Number,
        required: false
    },
    date: String,
      products: [
      {
            _id:{
                ref: "Product",
                type: Schema.Types.ObjectId
            },
            name: String,
            price: Number,
            description: String,
            quantity: Number,
            description: String,
            image: String,
            // review: {
            //     type: String,
            //     default: 'NoReview'
            // }
       }
      ],
    // products: [{
    //     ref: "Product",
    //     type: Schema.Types.ObjectId,
        
    // }],
    status: {
        type: String,
        default:"Pending",
        required: true
    },
    shipping: {
		street: String,
		state: String,
        number: Number,
		floor: String,
		zip: Number,
        between: String
	},
    cost: {
        type: Number
    },
    quantity: {
        type: Number
    },
    payment: {
        type: String,
        default:""
    },
    },
{
    timestamps: false,
    versionKey: false,
  }
)

const Order = model('Order', orderSchema)

module.exports = Order
