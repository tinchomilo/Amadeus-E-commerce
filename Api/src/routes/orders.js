const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const {transporter, emailer } = require('../config/email')


router.post('/', async (req, res, next) => {
  const { buyer, phone, products, shipping, payment, date, user, cost, quantity } = req.body;
  console.log('products', products)
  try {
    const newOrder = new Order({
      phone,
      shipping,
      payment,
      date,
      cost,
      quantity
    });

    newOrder.products = products;

    const foundUser = await User.findOne({ email: user.email })
    if (!foundUser) {
      const newUser = new User({
        name: user.name,
        //surname: user.family_name,
        nickname: user.nickname,
        picture: user.picture,
        email: user.email,
        sub: user.sub
      })

      newOrder.buyer = newUser
      transporter.sendMail(emailer(user))
      const savedUser = await newUser.save();
    } else {
      newOrder.buyer = foundUser
    }

    if (newOrder) {
      const savedOrder = await newOrder.save();
      userOrder = await User.updateOne({ email: user.email }, { $addToSet: { orders: [savedOrder] } })
      userShipping = await User.updateOne({ email: user.email }, { $addToSet: { shipping: savedOrder.shipping } })
      console.log('este es el id de la orden ' + savedOrder._id)
      return res.status(200).send(savedOrder)
    }
    return res.status(404).send('Error: the order has not been created.')

  } catch (e) {
    next(e);
  }
});



router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find().populate('products').populate('buyer');
    if (orders.length) {
      return res.status(200).send(orders);
    }
    return res.status(404).send('Orders not found.')

  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('products').populate('buyer')

    if (order) {
      return res.status(200).send(order);
    }
    return res.status(404).send('Order not found.')

  } catch (e) {
    next(e);
  }
});


router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body
  try {
    const orderUpdated = await Order.findByIdAndUpdate(id, req.body, { new: true });

    if (orderUpdated==={}) {
      res.status(404).send('Order not found.')
    } else {
      res.status(200).send(orderUpdated)
    }
  } catch (e) {
    next(e);
  }
});

router.put('/stock/:id', async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body

  
  try {
    const orderUpdated = await Order.findByIdAndUpdate(id, req.body, { new: true });
    
    if (orderUpdated && status === 'approved') { 
      orderUpdated.products.forEach(async e => {
       return await Product.updateOne({ name: e.name }, { $inc: { stock: -e.quantity } }, { new: true })
      })
    }


    if (orderUpdated==={}) {
      res.status(404).send('Order not found.')
    } else {
      res.status(200).send(orderUpdated)
    }
  } catch (e) {
    next(e);
  }
})
module.exports = router;
