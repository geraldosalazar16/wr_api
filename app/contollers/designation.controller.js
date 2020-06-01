const db = require("../models");
const { body } = require('express-validator/check')
const { validationResult } = require('express-validator/check');
const Designation = db.designation;

/*
get list of designations by partner  */
exports.getDesignationsByPartner = function (req, res, next) {
    let designations = [];
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }else {
      req.body.partnerId = parseInt(req.body.partnerId);
      Designation.findAll({ where: { partner_id : req.body.partnerId }}).then(function (designation) {
        designations = designation;
        return res.status(200).json(designations);
      })
      .catch(err => {
        res.status(500).send({ "err": err.message });
      });
    
    }
  
  };
  
  exports.validate = (method) => {
    switch (method) {
      case 'designationsList': {
        return [
          body('partnerId', "Partner name doesn't exists").exists().isInt({ gt: 0 }),
        ]
      };
        break;
  
    }
  };