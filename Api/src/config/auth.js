var jwt = require("express-jwt");
var jwks = require("jwks-rsa");
require('dotenv').config();

const { AUTH0_AUDIENCE, AUTH0_DOMAIN } = process.env

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

var getManagementApiJwt = () => {
  var request = require("request");
  return new Promise(function (resolve, reject) {
    var options = { method: 'POST',
    url: 'https://dev-0-knpzfi.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"client_id":"Vah5UjdTgha9hux3GjkugY1hSE0k7qfS","client_secret":"uiBXMGQjsGulOBeQhl_ApW3VgWM46gwIy9N3_Y-gxjng1o3ejv96w3wnsPwReSFP","audience":"https://dev-0-knpzfi.us.auth0.com/api/v2/","grant_type":"client_credentials"}' };
  
    request(options, function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        resolve(JSON.parse(body))
      }
    })
  })
}

module.exports = {
  jwtCheck,
  getManagementApiJwt
};
