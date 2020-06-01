const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      user_name: req.body.userName,deleted: 0
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        err: "Failed! Username is already in use!"
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.userEmail.trim(),deleted: 0
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          err: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

checkDuplicateEmail = (req, res, next) => {
    // Email
    User.findOne({
      where: {
        email: req.body.userEmail.trim(),deleted: 0
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          err: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
 
};

checkDuplicateEmailOnUpdate = (req, res, next) => {
  // Email
  User.findOne({
    where: {
      email: req.body.userEmail.trim(),deleted: 0, id: { $not: req.body.userId}
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        err: "Failed! Email is already in use!"
      });
      return;
    }

    next();
  });

};
const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkDuplicateEmail: checkDuplicateEmail,
  checkDuplicateEmailOnUpdate: checkDuplicateEmailOnUpdate,

};

module.exports = verifySignUp;