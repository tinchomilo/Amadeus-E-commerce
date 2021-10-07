const express = require("express");
const {jwtCheck} = require("../config/auth");

const router = express.Router();

router.get("/", jwtCheck, function (req, res) {
  res.send("hola estoy en /auth");
});



module.exports = router;
// router.get("/private", checkJwt, function (req, res) {
//   console.log("entre a api private");
//   res.json({
//     message:
//       "Hello from a private endpoint! You need to be authenticated to see this.",
//   });
// });

// const checkScopes = jwtAuthz(['read:messages']);
// router.get('/private-scoped', checkJwt, checkScopes, function (req, res) {
//     res.json({
//         message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
//     });
// });


