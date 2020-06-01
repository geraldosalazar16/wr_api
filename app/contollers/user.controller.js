const db = require("../models");
const config = require("../../config/auth.config");
const { body } = require('express-validator/check')
const { validationResult } = require('express-validator/check');
const User = db.user;
const Branch = db.branch;
const BranchUser = db.branchUser;

const Verificationtoken = db.verificatioToken;
const auditLog = require('./log.controller')
var log = {};
//encription password
const key = "secretkey";
const crypto = require("crypto");
let emailData = {};
function encrypt(key, data) {
  var cipher = crypto.createCipher('aes-256-cbc', key);
  var crypted = cipher.update(data, 'utf-8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(key, data) {
  try {
    var decipher = crypto.createDecipher('aes-256-cbc', key);
    var decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
  catch (ex) {
    return false;
  }
}

/* head office registarion */
exports.usersCreate = (req, res) => {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    let shortId = require('shortid');
    let a = Math.floor(100000 + Math.random() * 900000);   
    a = String(a);
    a = a.substring(0,4);
    let companyCode =  req.body.companyName.substring(0,3) + a;

    // Save User to Database
    User.create({
      partner_id: parseInt(req.body.partnerId),
      business_id: parseInt(req.body.businessId),
      //business_id: 1,
      company_code: companyCode,
      company_name: req.body.companyName,
      title: req.body.title,
      first_name: req.body.firstName.trim(),
      last_name: req.body.lastName.trim(),
      email: req.body.userEmail.trim(),
      designation_id: req.body.designationId,
      user_name: req.body.userName,
      password: encrypt(key, req.body.password),
      role_id: 2,
      is_verified: 1
    })
      .then(user => {
        if (user) {
          Verificationtoken.create({
            user_id: user.id,
            token: encrypt(key, user.id.toString()),
            type: 'userVerify',

          })
            .then(token => {

              if (token) {
                log.module_name = "signup";
                log.activity_name = "user adding with wealth runner";
                log.created_by = user.id;
                log.status = 1;
                auditLog.createAuditLog(log);
                return res.status(200).json({ "res": 'User Created & verification email sent sucessfully' });

              }
            })
        }
      })

      .catch(err => {
        res.status(500).send({ "err": err.message });
      });
  }
};

/*
actiate and inactivate users   
*/
exports.changeUserStatus = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    User.update({
      active: req.body.userStatus,
      modified_by: req.user.id,
      updated_at: new Date()
    }, {
      where: { id: req.body.userId },
      returning: true,
      plain: true
    })
      .then(function (result) {
        if (result[1] == 1) {
          return res.status(200).json({
            "res": "User status was changed successfully."
          });
        } else {
          return res.status(401).json({
            "err": `Cannot update user status Maybe user was not found !`
          });
        }
      })
      .catch(err => {
        res.status(500).send({ "err": err.message });
      });
  }
};
/*
delete the user
*/
exports.userDelete = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    User.update({
      deleted: 1,
      deleted_at: new Date(),
      deleted_by: req.user.id
    }, {
      where: { id: req.body.userId },
      returning: true,
      plain: true
    })
      .then(function (result) {
        if (result[1] == 1) {
          return res.status(200).json({
            "res": "User deleted successfully."
          });
        } else {
          return res.status(401).json({
            "err": `Cannot delete user maybe user was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({ "err": err.message });
      });
  }
};
/*
password change the user
*/
exports.userPasswordChange = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    User.update({
      password: encrypt(key, req.body.newPassword)
    }, {
      where: { id: req.body.userId },
      returning: true,
      plain: true
    })
      .then(function (result) {
        if (result[1] == 1) {
          return res.status(200).json({
            "res": "password changed successfully."
          });
        } else {
          return res.status(400).json({
            "err": `Cannot password updated  Maybe user was not found !`
          });
        }
      })
      .catch(err => {
        res.status(500).send({ "err": err.message });
      });
  }
};
/*
update user profile
*/
exports.usersProfileUpdate = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    User.update({
      partner_id: parseInt(req.body.partnerId),
      company_name: req.body.companyName,
      title: req.body.title,
      first_name: req.body.firstName.trim(),
      last_name: req.body.lastName.trim(),
      email: req.body.userEmail.trim(),
      designation_id: parseInt(req.body.designationId),
      address_1: req.body.address1,
      address_2: req.body.address2,
      address_3: req.body.address3,
      subrub: req.body.subrub,
      state_id: parseInt(req.body.stateId),
      country_id: parseInt(req.body.countryId),
      postal_code: req.body.postalCode,
      modified_by: req.user.id,
      updated_at: new Date()

    }, {
      where: { id: req.body.userId },
      returning: true,
      plain: true
    })
      .then(function (result) {
        if (result[1] == 1) {
          log.module_name = "Head Office update";
          log.activity_name = "user update with wealth runner";
          log.ceated_by = req.body.userId;
          log.status = 1;
          auditLog.createAuditLog(log);
          return res.status(200).json({
            "res": "User details updated successfully."
          });
        } else {
          log.module_name = "Head Office update";
          log.activity_name = "user update with wealth runner";
          log.ceated_by = req.body.userId;
          log.status = 0;
          auditLog.createAuditLog(log);
          return res.status(401).json({
            "err": `Cannot user updated  Maybe user was not found !`
          });
        }
      })
      .catch(err => {
        log.module_name = "Head Office update";
        log.activity_name = "user update with wealth runner";
        log.ceated_by = req.body.userId;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};

/*
 Check user email is alredy exists or not 
 */
exports.checkEmail = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    User.findOne({
      where: {
        email: req.body.userEmail.trim()
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  }
};

/*
 Check user name is alredy exists or not 
 */
exports.checkUserName = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    User.findOne({
      where: {
        user_name: req.body.userName
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! User Name is already in use!"
        });
        return;
      }
      next();
    });
  }
};

/*
get single user details   */
exports.getUserProfile = function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    let userData = {};
    User.findOne({
      where: {
        id: req.body.userId
      }
    }).then(function (user) {
      userData = user;
      return res.status(200).json(userData)
    })
      .catch(err => {
        res.status(500).send({ "err": err.message });
      });
  }
};

/* branch user creation */
exports.createBranchUser = (req, res) => {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.roleId = parseInt(req.body.roleId);
    req.body.designationId = parseInt(req.body.designationId);
    // Save User to Database
    User.create({
      //business_id: parseInt(req.body.businessId),
      business_id: 1,
      company_id: req.user.id,
      title: req.body.title,
      first_name: req.body.firstName.trim(),
      last_name: req.body.lastName.trim(),
      email: req.body.userEmail.trim(),
      designation_id: req.body.designationId,
      user_name: req.body.userName,
      password: encrypt(key, req.body.password),
      contact_number_1: req.body.contactNo1,
      contact_number_2: req.body.contactNo2,
      address_1: req.body.address1,
      address_2: req.body.address2,
      address_3: req.body.address3,
      subrub: req.body.subrub,
      state_id: parseInt(req.body.stateId),
      country_id: parseInt(req.body.countryId),
      postal_code: req.body.postalCode,
      created_by: req.user.id,
      role_id: 3,
      is_verified: 1,
      active: 1,
      deleted: 0
    })
      .then(user => {
        if (user) {

          log.module_name = "Company";
          log.activity_name = " Company user adding with wealth runner";
          log.created_by = req.user.id;
          log.status = 1;
          auditLog.createAuditLog(log);
          // emailData.email = req.body.userEmail;
          // emailData.userName = req.body.firstName + ' ' + req.body.lastName;
          // emailData.password = req.body.password;
          // emailData.loginName = req.body.userName;
          // email.send(share.mailOptions.sendLoginDetailsBranchUser(emailData));
          return res.status(200).json({ "res": 'User Created  sucessfully' });

        }
      })

      .catch(err => {
        log.module_name = "Company";
        log.activity_name = " Company user adding with wealth runner";
        log.created_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};

/** * barnch user profile update  */
exports.branchUserUpdate = function (req, res, next) {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.userId = parseInt(req.body.userId);
    req.body.designationId = parseInt(req.body.designationId);
    User.update({
      title: req.body.title,
      first_name: req.body.firstName.trim(),
      last_name: req.body.lastName.trim(),
      email: req.body.userEmail.trim(),
      designation_id: req.body.designationId,
      contact_number_1: req.body.contactNo1,
      contact_number_2: req.body.contactNo2,
      address_1: req.body.address1,
      address_2: req.body.address2,
      address_3: req.body.address3,
      subrub: req.body.subrub,
      state_id: parseInt(req.body.stateId),
      country_id: parseInt(req.body.countryId),
      postal_code: req.body.postalCode,
      modified_by: req.user.id,
      updated_at: new Date()

    }, {
      where: { id: req.body.userId },
      returning: true,
      plain: true
    }).then(function (result) {
      if (result[1] == 1) {
        log.module_name = "Company";
        log.activity_name = "Company user update with wealth runner";
        log.ceated_by = req.body.userId;
        log.status = 1;
        auditLog.createAuditLog(log);
        return res.status(200).json({
          "res": "User details updated successfully."
        });
      } else {
        log.module_name = "Company";
        log.activity_name = "Company user update with wealth runner";
        log.ceated_by = req.body.userId;
        log.status = 0;
        auditLog.createAuditLog(log);
        return res.status(401).json({
          "err": `Cannot user updated  Maybe user was not found !`
        });
      }
    })
      .catch(err => {
        log.module_name = "Company";
        log.activity_name = "Company user update with wealth runner";
        log.ceated_by = req.body.userId;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });


  }




};

/*
 user password change
 */
exports.changeUserName = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    User.update({
      user_name: req.body.userName,
      modified_by: req.user.id,
      updated_at: new Date()
    }, {
      where: { id: req.body.userId },
      returning: true,
      plain: true
    })
      .then(function (result) {
        if (result[1] == 1) {
          log.module_name = "user";
          log.activity_name = "user name change";
          log.ceated_by = req.body.userId;
          log.status = 1;
          auditLog.createAuditLog(log);
          return res.status(200).json({
            "res": "User name changed successfully."
          });
        } else {
          log.module_name = "user";
          log.activity_name = "user name change";
          log.ceated_by = req.body.userId;
          log.status = 0;
          auditLog.createAuditLog(log);
          return res.status(401).json({
            "err": `Cannot change user name maybe user was not found!`
          });
        }
      })
      .catch(err => {
        log.module_name = "user";
        log.activity_name = "user name change";
        log.ceated_by = req.body.userId;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};

exports.changePasswordThroughLink = function (req, res) {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    let userId = decrypt(key, req.body.token);
    let encryptpassword = encrypt(key, req.body.password);
    const tokenCondition = [
      { token: req.body.token, type: 'forgotpassword' },

    ];
    Verificationtoken.findOne({ where:  { token: req.body.token, type: 'forgotpassword' } }).then(function (user) {

      if (token) {
        User.update({
          password: encryptpassword,
          modified_by: userId,
          updated_at: new Date()
        }, {
          where: { id: userId },
          returning: true,
          plain: true
        })
          .then(function (result) {
            if (result[1] == 1) {
              log.module_name = "password";
              log.activity_name = "forgot password by user through mail";
              log.ceated_by = userId;
              log.status = 1;
              auditLog.createAuditLog(log);
              return res.status(200).json({
                "res": "Password changed successfully."
              });
            } else {
              log.module_name = "password";
              log.activity_name = "forgot password by user through mail";
              log.ceated_by = userId;
              log.status = 0;
              auditLog.createAuditLog(log);
              return res.status(401).json({
                "err": `Cannot change user name maybe user was not found!`
              });
            }
          })
          .catch(err => {
            log.module_name = "user";
            log.activity_name = "user name change";
            log.ceated_by = req.body.userId;
            log.status = 0;
            auditLog.createAuditLog(log);
            res.status(500).send({ "err": err.message });
          });
      }
      else {
        return res.status(401).json({ "res": "Please check url once" });
      }
    })
      .catch(err => {
        res.status(500).send({ "err": err.message });
      });
  }
};


exports.forgotPasswordLink = function (req, res, next) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    User.findOne({
      where: {
        email: req.body.userEmail.trim()
      }
    }).then(user => {
      if (user) {
        let tokenId = encrypt(key, user.id.toString())
        Verificationtoken.create({
          user_id: user.id,
          token: tokenId,
          type: 'forgotpassword',

        })
          .then(token => {
            // emailData.email = user.email;
            // emailData.userName = user.first_name + ' ' + user.last_name;
            // emailData.tokenCode = tokenId;
            // email.send(share.mailOptions.sendForgotpasswordEmail(emailData));
            return res.status(200).json({ "res": 'Email sent successfully' });
          })
      }
      else {
        return res.status(401).json({ "err": "There is no account with this Email" });
      }
    }).catch(err => {
      res.status(500).send({ "err": err.message });
    });
  }
};

/*
 Check user verification link  verified or not  
 */
exports.verifyuserAccount = function (req, res, next) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    userId = decrypt(key, req.body.token);
    Verificationtoken.findOne({ where: { token: req.body.token } }).then(function (user) {

      if (token) {

        User.findOne({
          where: {
            id: userId
          }
        }).then(user => {
          if (user && user.is_verified) {
            res.status(400).json({ "res": "Your email is alredy Verified" });
          }
          else {
            User.update({
              is_verified: 1,
              modified_by: userId,
              updated_at: new Date()
            }, {
              where: { id: userId },
              returning: true,
              plain: true
            })
              .then(function (result) {
                if (result[1] == 1) {
                  log.module_name = "user";
                  log.activity_name = "use verify account";
                  log.ceated_by = userId;
                  log.status = 1;
                  auditLog.createAuditLog(log);
                  return res.status(200).json({
                    "res": "Your account verified successfully"
                  });
                } else {
                  log.module_name = "user";
                  log.activity_name = "use verify account";
                  log.ceated_by = userId;
                  log.status = 0;
                  auditLog.createAuditLog(log);
                  return res.status(401).json({
                    "err": `Cannot change user name maybe user was not found!`
                  });
                }
              })
              .catch(err => {
                log.module_name = "user";
                log.activity_name = "use verify account";
                log.ceated_by = req.body.userId;
                log.status = 0;
                auditLog.createAuditLog(log);
                res.status(500).send({ "err": err.message });
              });
          }


        });


      }
      else {
        return res.status(401).json({ "res": "Please check url once" });
      }
    })
      .catch(err => {
        res.status(500).send({ "err": err.message });
      });

  }

};
/*
get list of head offices  */
exports.listOfHeadOffices = function (req, res, next) {

  let users = {};
  users.list = [];
  User.findAll({ where: { deleted: 0 ,role_id: 2 }}).then(function (users) {
    users.list = users;
    // log.module_name = "users";
    // log.activity_name = "Headoffices  list retriving";
    // log.ceated_by = req.user.id;
    // log.status = 1;
    // auditLog.createAuditLog(log);
    return res.status(200).json(users);
  })
  .catch(err => {
    console.log("err", err)
    // log.module_name = "users";
    // log.activity_name = "Headoffices  list retriving";
    // log.ceated_by = req.user.id;
    // log.status = 0;
    // auditLog.createAuditLog(log);
    res.status(500).send({ "err": err.message });
  });


};


/*get list of branches bsed on company  */
  exports.usersListByCompany = function (req, res, next) {
    const errors = validationResult(req); 
  
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    else {
      
    let companyUsers = {};
    companyUsers.list = [];
    User.findAll({ where: { deleted: 0 ,role_id: 3, company_id: req.user.id}}).then(function (users) {
      companyUsers.list = users;
      log.module_name = "Comapny users";
      log.activity_name = "Comapny users  list retriving";
      log.ceated_by = req.user.id;
      log.status = 1;
      auditLog.createAuditLog(log);
      return res.status(200).json(companyUsers);
    })
    .catch(err => {
      log.module_name = "Comapny users";
      log.activity_name = "Comapny users  list retriving";
      log.ceated_by = req.user.id;
      log.status = 0;
      auditLog.createAuditLog(log);
      res.status(500).send({ "err": err.message });
    });
  

    }
  };

  /*get list of branches bsed on users   */
  exports.branchesListByUser = function (req, res, next) {
    const errors = validationResult(req); 
  
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    else {
    req.body.userId = parseInt(req.body.userId);
    let userBranches = {};
    userBranches.list = [];


    Branch.findAll({
      include: [{
        model: BranchUser,
        required: true,
        where: {user_id : req.body.userId}
       }]
    }).then(branches => {
      log.module_name = "branch";
      log.activity_name = "branches list besd on users";
      log.ceated_by = req.user.id;
      log.status = 1;
      auditLog.createAuditLog(log);
      userBranches.list = branches;
      return res.status(200).json(userBranches);
    
    })
    .catch(err => {
      log.module_name = "branch";
      log.activity_name = "branches list besd on users";
      log.ceated_by = req.user.id;
      log.status = 0;
      auditLog.createAuditLog(log);
      res.status(500).send({ "err": err.message });
    });
  

    }
  };
/* express validator functions */
exports.validate = (method) => {
  switch (method) {
    case 'createUser': {
      return [
        body('partnerId', "Patner name doesn't exists").exists().isInt({ gt: 0 }),
        body('businessId', "Business Information  doesn't exists").exists().isInt({ gt: 0 }),
        body('companyName', "Company name doesn't exists").exists().isString(),
        body('title', "title doesn't exists").exists().isString().isAlpha(),
        body('firstName', "First name doesn't exists").exists().isString(),
        body('lastName', "Last name doesn't exists").exists().isString(),
        body('userEmail', "Please enter valid email").exists().isEmail(),
        body('designationId', "Designation name doesn't exists").exists().isInt({ gt: 0 }),
        body('userName', "UserName doesn't exists").exists().isLength({ min: 7 }).withMessage(' Username must be at least 7 chars long'),
        body('password', "password doesn't exists").exists().isLength({ min: 7 }).withMessage('Password must be at least 7 chars long'),

      ]
    };
      break;
    case 'verifyAccount': {
      return [
        body('token', "token doesn't exists").exists(),
      ]
    };
      break;
    case 'createBranchUser': {
      return [
        body('title', "title doesn't exists").exists().isString().isAlpha(),
        body('firstName', "First name doesn't exists").exists().isString(),
        body('lastName', "Last name doesn't exists").exists().isString(),
        body('userEmail', 'Please enter valid email').exists().isEmail(),
        body('designationId', "Designation name doesn't exists").exists().isInt(),
        body('contactNo1', "contactNo1 doesn't exists").exists().isLength({ min:10,max: 12 }).withMessage('Contact No1 length should be minimum  10 and maximum 12'),
        body('contactNo2', "contactNo2 doesn't exists").optional({ checkFalsy: true }).isLength({ min:10,max: 12 }).withMessage('Contact No2 length should be minimum  10 and maximum 12'),
        body('address1', "Address-1 doesn't exists").exists().isString(),
        body('address2', "Address-2 doesn't exists").exists().isString(),
        body('address3', "address-3 doesn't exists").optional({ checkFalsy: true }).isString(),
        body('subrub', "subrub doesn't exists").exists().isString(),
        body('stateId', "State name doesn't exists").exists().isInt({ gt: 0 }),
        body('countryId', "Country name doesn't exists").exists().isInt({ gt: 0 }),
        body('postalCode', "Postal code doesn't exists").exists().isInt(),
        body('userName', "UserName doesn't exists").exists().isLength({ min: 7 }).withMessage(' Username must be at least 7 chars long'),
        body('password', "password doesn't exists").exists().isLength({ min: 7 }).withMessage('Password must be at least 7 chars long'),

      ]
    };
      break;
    case 'checkEmail': {
      return [
        body('email', 'Please enter valid email').exists().isEmail(),
      ]
    };
      break;
    case 'checkUsername': {
      return [
        body('userName', 'Please enter valid username').exists().isLength({ min: 7 }).withMessage(' Username must be at least 7 chars long'),
      ]
    };
      break;
    case 'forgotPasssword': {
      return [
        body('userEmail', 'Please enter valid email').exists().isEmail(),
      ]
    };
      break;
    case 'userStatusChange': {
      return [
        body('userId', 'Please enter valid userId').exists().isInt({ gt: 0 }),
        body('userStatus', "status doesn't exists").exists().isInt({ lt: 2 })

      ]
    };
      break;
    case 'userDelete': {
      return [
        body('userId', 'Please enter valid userId').exists().isInt({ gt: 0 }),
      ]
    };
      break;
    case 'passwordChange': {
      return [
        body('userId', "User id doesn't exists").exists().isInt({ gt: 0 }),
        body('newPassword', "Password doesn't exists").exists().isLength({ min: 7 }).withMessage('Password must be at least 7 chars long'),
      ]
    };
      break;
    case 'userProfileUpdate': {
      return [
        body('userId', "User id doesn't exists").exists().isInt({ gt: 0 }),
        body('partnerId', "Patner name doesn't exists").exists().isInt({ gt: 0 }),
        body('companyName', "Company name doesn't exists").exists().isString(),
        body('title', "title doesn't exists").exists().isString().isAlpha(),
        body('firstName', "First name doesn't exists").exists().isString(),
        body('lastName', "Last name doesn't exists").exists().isString(),
        body('userEmail', "Please enter valid email").exists().isEmail(),
        body('designationId', "Designation name doesn't exists").exists().isInt({ gt: 0 }),
        body('address1', "Address-1 doesn't exists").optional({ checkFalsy: true }).isString(),
        body('address2', "Address-2 doesn't exists").optional({ checkFalsy: true }).isString(),
        body('address3', "address-3 doesn't exists").optional({ checkFalsy: true }).isString(),
        body('subrub', "subrub doesn't exists").optional({ checkFalsy: true }).isString(),
        body('stateId', "State name doesn't exists").optional({ checkFalsy: true }).isInt({ gt: 0 }),
        body('countryId', "Country name doesn't exists").optional({ checkFalsy: true }).isInt({ gt: 0 }),
        body('postalCode', "Postal code doesn't exists").optional({ checkFalsy: true }).isInt(),

      ]
    };
      break;
    case 'getUserProfile': {
      return [
        body('userId', "User id doesn't exists").exists().isInt({ gt: 0 }),
      ]
    };
      break;
    case 'changeUserName': {
      return [
        body('userId', "User id doesn't exists").exists().isInt({ gt: 0 }),
        body('userName', 'Please enter valid username').exists().isLength({ min: 7 }).withMessage(' Username must be at least 7 chars long'),
      ]
    };
      break;

    case 'updateBranchUser': {
      return [
        body('userId', "user Id doesn't exists").exists().isInt({ gt: 0 }),
        body('title', "title doesn't exists").exists().isString().isAlpha(),
        body('firstName', "First name doesn't exists").exists().isString(),
        body('lastName', "Last name doesn't exists").exists().isString(),
        body('userEmail', 'Please enter valid email').exists().isEmail(),
        body('designationId', "Designation name doesn't exists").exists().isInt(),
        body('contactNo1', "contactNo1 doesn't exists").exists().isLength({ min:10,max: 12 }).withMessage('Contact No1 length should be minimum  10 and maximum 12'),
        body('contactNo2', "contactNo2 doesn't exists").optional({ checkFalsy: true }).isLength({ min:10,max: 12 }).withMessage('Contact No2 length should be minimum  10 and maximum 12'),
        body('address1', "Address-1 doesn't exists").exists().isString(),
        body('address2', "Address-2 doesn't exists").exists().isString(),
        body('address3', "address-3 doesn't exists").optional({ checkFalsy: true }).isString(),
        body('subrub', "subrub doesn't exists").exists().isString(),
        body('stateId', "State name doesn't exists").exists().isInt({ gt: 0 }),
        body('countryId', "Country name doesn't exists").exists().isInt({ gt: 0 }),
        body('postalCode', "Postal code doesn't exists").exists().isInt(),
      ]
    };
      break;
      case 'branchesList': {
        return [
          body('userId', "user Id doesn't exists").exists().isInt({ gt: 0 }),
        ]
      };
        break;

  }
};