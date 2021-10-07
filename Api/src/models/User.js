const { Schema, model } = require("mongoose");
//const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    nickname: {
        type: String,
        required: false
    },
    picture: {
        type: String,
        required: false
    },
    email: {
      type: String,
      unique: true,
      required: true,
      
    },
    password: {
      type: String,
    },
    sub: {
      type: String,
    },
    phone: {
      type: Number,
    },
    nickname: {
      type: String,
    },
    shipping: [{}],
    favorites: [
      {
        ref: "Product",
        type: Schema.Types.ObjectId,
      },
    ],
    cart: [
      {
        _id: {
          ref: "Product",
          type: Schema.Types.ObjectId,
        },
        quantity: Number,
      },
    ],
    orders: [
      {
        ref: "Order",
        type: Schema.Types.ObjectId
    }],
    shoppingHistory: [{
        type: Array
    }],
    shipping: [{
		// type: Array
	}],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

/* userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
  
userSchema.methods.validatePassword = async function (password, newPassword) {
  return await bcrypt.compare(password, newPassword);
}; */

const User = model("User", userSchema);

module.exports = User;
