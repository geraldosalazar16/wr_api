const db = require("../models");
const config = require("../../config/auth.config");
const User = db.user;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var key = "secretkey";
var crypto = require("crypto");
function encrypt(key, data) {
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }
  //===============================================================================================
  function decrypt(key, data) {
    var decipher = crypto.createDecipher('aes-256-cbc', key);
    var decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }


exports.signin = (req, res) => {
  User.findOne({
    where: {
      user_name: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'There is no account with this user name' });
      }
      const b2 = decrypt(key,user.password);

      if (req.body.password != b2) {
        return res.status(401).json({ message: 'Your password is invalid. Please try again.' });
      }
       else {
           if((!user.active || user.deleted) && user.is_verified) {
            return res.status(401).json({ message: 'Your account is inactive (or) deleted. Contact your administrator to activate it.' });
           }
           else if(user.active && !user.is_verified) {
            res.status(401).json({ message: 'Please verify your account.'});
           }
           else {
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
              });
            let userInfo = {};
            userInfo.companyName = user.company_name;
            userInfo.title = user.title;
            userInfo.userName = user.user_name;
            userInfo.firstName = user.first_name;
            userInfo.lastName = user.last_name;
            userInfo.userEmail = user.email;
            userInfo.roleId = user.role_id;
            userInfo.userId = user.id;
            userInfo.designationId = user.designation_id;
            userInfo.contactNo1 = user.contact_number_1;
            userInfo.contactNo2 = user.contact_number_2;
            userInfo.address1 = user.address_1;
            userInfo.address2 = user.address_2;
            userInfo.address3 = user.address_3;
            userInfo.subrub = user.subrub;
            userInfo.stateId = user.state_id;
            userInfo.countryId = user.country_id;
            userInfo.postalCode = user.postal_code
            if ([1,2].indexOf(userInfo.roleId) < 0 ) {
              userInfo.branchId = user.branch_id;
              userInfo.partnerId = user.company_id;
            }else  {
              userInfo.partnerId = user.partner_id;
              userInfo.companyCode = user.company_code;
              userInfo.businessId = user.business_id;
              userInfo.branchId = user.branch_id;
            }
            userInfo.token = token;
            return res.status(200).json({ 'user': userInfo });
           }
       }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};