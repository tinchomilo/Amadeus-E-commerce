const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require('../models/Product');
const { body, validationResult } = require("express-validator");
const { transporter, emailer, emailOrder } = require('../config/email')
const { jwtCheck, getManagementApiJwt } = require("../config/auth");


router.post(
  "/", jwtCheck,
  /* 
  body("name").isLength({ max: 50 }),
  body("surname").isLength({ max: 50 }),
  body("password").isLength({ min: 5 }, { max: 20 }),
  body("email").isEmail().normalizeEmail(), */
  async (req, res, next) => {
    const { user } = req.body;
    console.log('user en post', user)
    try {
      const foundUser = await User.findOne({ email: user.email })
        .populate("favorites")
        .populate("cart._id")
        .populate({
          path: 'orders',
          populate: { path: 'products' }
        })
      //.populate("orders");

      if (foundUser) {
        res.json(foundUser);
      } else {
        /*  //Validaciones
            if (!name) return res.send("Debe agregar un nombre");
            if (!surname) return res.send("Debe agregar un apellido");
            if (!email) return res.send("Debe agregar un email");
            searchMail = await User.findOne({ email: email });
            if (searchMail) return res.send("El email ya existe");

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
            */
        const newUser = new User({
          email: user.email,
          name: user.name,
          picture: user.picture,
          nickname: user.nickname,
          sub: user.sub
        });
        const userSaved = await newUser.save();
        transporter.sendMail(emailer(user))

        res.json(userSaved);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", jwtCheck, async (req, res, next) => {
  const { id } = req.params;
  try {
    user = await User.findByIdAndDelete(id);
    res.send("User has been successfully removed");
  } catch (err) {
    next(err);
  }
});

router.put("/:id", jwtCheck, async (req, res, next) => {
  // const { name, surname, password, email, phone} = req.body;
  const { id } = req.params;
  try {
    const modifiedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("favorites")
      .populate("cart._id")
      .populate({
        path: 'orders',
        populate: { path: 'products' }
      })
    //res.json(updatedCategory)
    console.log('modificado', modifiedUser)
    res.send(modifiedUser);
  } catch (err) {
    next(err);
  }
});

router.get("/", jwtCheck, async (req, res, next) => {
  try {
    const users = await User.find()
      .populate("cart")
      .populate({
        path: 'orders',
        populate: { path: 'products' }
      })
      .populate("favorites");
    //res.json(updatedCategory)
    res.send(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id",/*  jwtCheck,  */async (req, res, next) => {
  const { id } = req.params;
  try {
    user = await User.findById(id)
      .populate("cart._id")
      .populate({
        path: 'orders',
        populate: { path: 'products' }
      })
      .populate("favorites");
      
    res.send(user);
  } catch (err) {
    next(err);
  }
});

//Ruta para agregar todos los productos del local storage al carrito
router.post("/cart",/*  jwtCheck, */ async (req, res, next) => {
  let { cart, user } = req.body;
  try {

    let foundUser = await User.findOne({ email: user.email })
    if (!foundUser) {
      const newUser = new User({
        name: user.name,
        //surname: user.family_name,
        nickname: user.nickname,
        picture: user.picture,
        email: user.email
      })
      newUser.cart = cart
      const savedUser = await newUser.save();
    } else {
      //userCart = await User.updateOne({_id: foundUser._id}, { $push: { cart: cart } })
      //userCart = await User.updateOne({_id: foundUser._id}, { $addToSet: { cart: cart } })
      userCart = await User.updateOne({ _id: foundUser._id }, { $set: { cart: cart } })
    }

    res.send('Se modifico el carrito')
  }
  catch (err) {
    next(err)
  }
});

//Crear Ruta para agregar Item al Carrito
router.post("/:idUser/cart/:idProduct", jwtCheck, async (req, res, next) => {
  const { idUser, idProduct } = req.params;

  try {
    user = await User.updateOne(
      { _id: idUser },
      { $addToSet: { cart: [idProduct] } }
    );
    res.send("El item se agrego correctamente");
  } catch (err) {
    next(err);
  }
});

//Crear Ruta para vaciar el carrito
router.delete("/:idUser/cart", jwtCheck, async (req, res, next) => {
  const { idUser } = req.params;

  try {
    user = await User.updateOne({ _id: idUser }, { $pull: { cart: [] } });
    res.send("El carrito quedo vacio");
  } catch (err) {
    next(err);
  }
});

//Crear Ruta que retorne el carrito de un usuario
router.get("/:idUser/cart", async (req, res, next) => {
  const { idUser } = req.params;
  try {
    user = await User.findOne({ _id: idUser }).populate("cart._id");
    res.send(user.cart);
  } catch (err) {
    next(err);
  }
});

//Crear Ruta que retorne todas las Ordenes de los usuarios
router.get("/:id/orders", jwtCheck, async (req, res, next) => {
  const { id } = req.params;

  try {
    let user = await User.findOne({ _id: id }).populate({
      path: 'orders',
      populate: { path: 'products' }
    });

    if (user.orders.length) {
      res.json(user.orders);
    } else {
      res.status(404).send("No orders found");
    }
  } catch (err) {
    next(err);
  }
});

//Crear Ruta que retorne todos los favoritos de un usuario
router.get("/:idUser/favorites", /* jwtCheck, */ async (req, res, next) => {
  const { idUser } = req.params;

  try {
    let user = await User.findOne({ _id: idUser }).populate("favorites");
    // console.log('user en get favorites', user)
    if (user.favorites.length) {
      res.json(user.favorites);
    } else {
      res.status(404).send("No favorites found");
    }
  } catch (err) {
    next(err);
  }
});

//Crear Ruta para agregar Item a Favoritos
router.post("/:idUser/favorites/:idProduct", jwtCheck, async (req, res, next) => {
  const { idUser, idProduct } = req.params;

  try {
    let user = await User.updateOne(
      { _id: idUser },
      { $addToSet: { favorites: [idProduct] } }
    );
    res.send("El item se agrego correctamente");
  } catch (err) {
    next(err);
  }
});

//Crear Ruta para eliminar Item de Favoritos
router.delete("/:idUser/favorites/:idProduct",/*  jwtCheck, */ async (req, res, next) => {
  const { idUser, idProduct } = req.params;

  try {
    let user = await User.updateOne(
      { _id: idUser },
      { $pull: { favorites: idProduct } }
    );
    res.send("El item se eliminó correctamente");
  } catch (err) {
    next(err);
  }
});

router.post("/:idUser/shipping", jwtCheck, async (req, res, next) => {
  const { idUser } = req.params;
  const { shipping } = req.body

  try {
    userShipping = await User.updateOne(
      { _id: idUser },
      { $addToSet: { shipping : shipping } }
    );
    res.send(userShipping);
  } catch (err) {
    next(err);
  }
});

router.post("/:idUser/purchaseEmail", async (req, res, next) => {
  const { idUser } = req.params;
  const orderUpdated = req.body
  try {
    const user = await User.findOne({ _id: idUser });
    if (orderUpdated.status === "approved") {
      transporter.sendMail(emailOrder(user, orderUpdated))
      res.send("El email se mando correctamente");
    }
  } catch (err) {
    next(err);
  }
});



router.get("/block/:userSub", jwtCheck, function (req, res) {
  const { userSub } = req.params;

  var request = require("request");
  console.log('usersub en block', userSub)

  getManagementApiJwt()
    .then((data) => {
      console.log('data', data)
      const token = data.access_token;
      var options = {
        method: "PATCH",
        url: "https://dev-0-knpzfi.us.auth0.com/api/v2/users/" + userSub,
        headers: {
          "authorization": "Bearer " + token,
          "content-type": "application/json",
        },
        body: {
          "blocked": true
        },
        json: true,
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.json(body);
      });
    });
  
});

router.get("/desblock/:userSub", jwtCheck, function (req, res) {
  const { userSub } = req.params;

  var request = require("request");
  console.log('usersub en block', userSub)

  getManagementApiJwt()
    .then((data) => {
      console.log('data', data)
      const token = data.access_token;
      var options = {
        method: "PATCH",
        url: "https://dev-0-knpzfi.us.auth0.com/api/v2/users/" + userSub,
        headers: {
          "authorization": "Bearer " + token,
          "content-type": "application/json",
        },
        body: {
          "blocked": false
        },
        json: true,
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.json(body);
      });
    });
  
});

module.exports = router;
