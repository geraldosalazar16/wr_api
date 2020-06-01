const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
const db = require("../models");
const User = db.user;
var validateJwt = expressJwt({ secret: config.secret });

function verifyToken()  {
//   let token = req.headers["x-access-token"];
// console.log("token", token);
//   if (!token) {
//     return res.status(403).send({
//       message: "No token provided!"
//     });
//   }

//   jwt.verify(token, config.secret, (err, decoded) => {
//     if (err) {
//       console.log("err", err);
//       return res.status(401).send({
//         message: "Unauthorized!"
//       });
//     }
//        User.findOne({
//       where: {
//         id: decoded.id
//       }
//     }).then(user => {
//       if (user) {
//         req.user = user;
//       }
//       next();
//       return;
//     });
//   });
return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to requestjwt.verify
    .use(function(req, res, next) {
      User.findOne({
              where: {
                id: req.user.id
              }
            }).then(user => {
              
                if (!user) return res.status(401).send('Unauthorized');
                req.user = user;
                next();
                  })  
     
    });
};
const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;