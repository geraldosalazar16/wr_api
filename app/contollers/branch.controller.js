const db = require("../models");
const { body } = require('express-validator/check')
const { validationResult } = require('express-validator/check');
const Branch = db.branch;
const User = db.user;
const BranchUser = db.branchUser;
const BusinessInformation = db.businessInformation;
const auditLog = require('./log.controller')
let log = {};
const dataUrl = require("../../config/url.config.js");
const axios = require('axios');

/** * Creates a new branch */
exports.createBranch = (req, res) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    let a = Math.floor(100000 + Math.random() * 900000);
    a = String(a);
    a = a.substring(0, 4);
    let branchCode = req.body.branchName.substring(0, 3) + a;
    req.body.partnerId = parseInt(req.body.partnerId);
    req.body.countryId = parseInt(req.body.countryId);
    req.body.stateId = parseInt(req.body.stateId);
    // Save User to Database
    Branch.create({
      company_id: req.body.partnerId,
      business_id: parseInt(req.body.businessId),
      //business_id: 1,
      code: branchCode,
      name: req.body.branchName,
      contact_number: req.body.contactNo,
      address_1: req.body.address1,
      address_2: req.body.address2,
      address_3: req.body.address3,
      subrub: req.body.subrub,
      state_id: req.body.stateId,
      country_id: req.body.countryId,
      postal_code: req.body.postalCode,
      created_by: req.user.id
    })
      .then(branch => {
        if (branch) {
          Branch.count({
            where: { business_id: req.body.businessId }
          }).then(async branches => {
            let brandName = await getBuinessName(req.body.businessId);
            console.log(brandName);
            log.module_name = "Branch";
            log.activity_name = "branch adding with wealth runner";
            log.ceated_by = req.user.id;
            log.status = 1;
            auditLog.createAuditLog(log);
            let branchesCount = branches
            let methodType = '';
            if (branchesCount > 1) methodType = "POST"
            else methodType = "PUT"
            let methodData = {
              brandName: brandName,
              partnerCodes: [branchCode],
              PCRMBrandId: req.body.businessId.toString()// This is the body part
            };
          let status =   await getBranchCodesByBussinessId(req.body.businessId,methodType,brandName);
          res.status(200).json({ "res": 'Branch created successfully' });
          })
            .catch(err => {
              res.status(500).send({ "err": err.message });
            });


        }
      })
      .catch(err => {
        log.module_name = "Branch user adding";
        log.activity_name = "branch user adding with wealth runner";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};
/* update branch details */
exports.updateBranch = function (req, res, next) {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {

    req.body.branchId = parseInt(req.body.branchId);
    req.body.countryId = parseInt(req.body.countryId);
    req.body.stateId = parseInt(req.body.stateId);
    Branch.update({
      name: req.body.branchName,
      contact_number: req.body.contactNo,
      address_1: req.body.address1,
      address_2: req.body.address2,
      address_3: req.body.address3,
      subrub: req.body.subrub,
      state_id: req.body.stateId,
      country_id: req.body.countryId,
      postal_code: req.body.postalCode,
      modified_by: req.user.id,
      updated_at: new Date()

    }, {
      where: { id: req.body.branchId },
      returning: true,
      plain: true
    })
      .then(function (result) {
        if (result[1] == 1) {
          log.module_name = "Branch";
          log.activity_name = "Branch update with wealth runner";
          log.ceated_by = req.user.id;
          log.status = 1;
          auditLog.createAuditLog(log);
          return res.status(200).json({
            "res": "Branch details updated successfully."
          });
        } else {
          log.module_name = "Branch";
          log.activity_name = "Branch update with wealth runner";
          log.ceated_by = req.body.userId;
          log.status = 0;
          auditLog.createAuditLog(log);
          return res.status(500).json({
            "err": `Cannot updated branch Maybe branch was not found !`
          });
        }
      })
      .catch(err => {
        log.module_name = "Branch";
        log.activity_name = "Branch update with wealth runner";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });


  }
};

/*Change branch status */
exports.branchStausChange = function (req, res, next) {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {

    req.body.branchId = parseInt(req.body.branchId);
    Branch.update({
      active: req.body.status,
      modified_by: req.user.id,
      updated_at: new Date()
    }, {
      where: { id: req.body.branchId },
      returning: true,
      plain: true
    })
      .then(async function (result) {
        console.log("result", result)
        if (result[1] == 1) {
          let bussinessId = await getBuinessIdByBranch(req.body.branchId);
          const status = await getBranchCodesByBussinessId(bussinessId,"POST",'');
          console.log("status", status);
          log.module_name = "Branch";
          log.activity_name = "branch status change";
          log.ceated_by = req.user.id;
          log.status = 1;
          auditLog.createAuditLog(log);
          return res.status(200).json({
            "res": "Branch status was changed successfully."
          });
        } else {
          log.module_name = "Branch";
          log.activity_name = "branch status change";
          log.ceated_by = req.user.id;
          log.status = 0;
          auditLog.createAuditLog(log);
          return res.status(401).json({
            "err": `Cannot update Branch status Maybe branch was not found !`
          });
        }
      })
      .catch(err => {
        log.module_name = "Branch";
        log.activity_name = "branch status change";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};

/*
get list of branches bsed on company  */
exports.branchListByCompany = function (req, res, next) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    let branches = {};
    branches.list = [];
    req.body.partnerId = parseInt(req.body.partnerId);
    Branch.findAll({ where: { deleted: 0, company_id: req.body.partnerId } }).then(function (branch) {
      branches.list = branch;
      log.module_name = "branches";
      log.activity_name = "branches list retriving";
      log.ceated_by = req.user.id;
      log.status = 1;
      auditLog.createAuditLog(log);
      return res.status(200).json(branches);
    })
      .catch(err => {
        console.log("err", err)
        log.module_name = "branches";
        log.activity_name = "branches list retriving";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });

  }
};

/*
get list of branches bsed on company  */
exports.activeBranchesList = function (req, res, next) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {


  }
};
/*
get list of branches bsed on company  */
exports.usersListByBranch = function (req, res, next) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.branchId = parseInt(req.body.branchId);
    let branchusers = {};
    branchusers.list = [];


    User.findAll({
      include: [{
        model: BranchUser,
        required: true,
        where: { branch_id: req.body.branchId }
      }],
      where: {
        deleted: 0
      }
    }).then(users => {
      branchusers.list = users;
      return res.status(200).json(branchusers);

    })
      .catch(err => {
        log.module_name = "Branch users";
        log.activity_name = "Branch users  list retriving";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });


  }
};
/*delete branch */
exports.branchDelete = function (req, res, next) {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.branchId = parseInt(req.body.branchId);
    Branch.update({
      deleted: 1,
      deleted_by: req.user.id,
      deleted_at: new Date()
    }, {
      where: { id: req.body.branchId },
      returning: true,
      plain: true
    })
      .then(async function (result) {
        console.log("result", result)
        if (result[1] == 1) {
          let bussinessId = await getBuinessIdByBranch(req.body.branchId);
          const status = await getBranchCodesByBussinessId(bussinessId,"POST",'');
          log.module_name = "branch";
          log.activity_name = "branch delete";
          log.ceated_by = req.user.id;
          log.status = 1;
          auditLog.createAuditLog(log);
          return res.status(200).json({
            "res": "Branch deleted successfully."
          });
        } else {
          log.module_name = "branch";
          log.activity_name = "branch delete";
          log.ceated_by = req.user.id;
          log.status = 0;
          auditLog.createAuditLog(log);
          return res.status(401).json({
            "err": `Cannot delete branch Maybe branch was not found !`
          });
        }
      })
      .catch(err => {
        log.module_name = "branch";
        log.activity_name = "branch delete";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};



/*delete branch user */
exports.branchUserDelete = function (req, res, next) {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.branchUserId = parseInt(req.body.branchUserId);
    BranchUser.destroy({
      where: { id: req.body.branchUserId }
    })
      .then(function (result) {
        if (result == 1) {
          log.module_name = "Branch";
          log.activity_name = "Branch assigned user delete";
          log.ceated_by = req.user.id;
          log.status = 1;
          auditLog.createAuditLog(log);
          return res.status(200).json({
            "res": "Branch user deleted successfully."
          });
        } else {
          log.module_name = "Branch";
          log.activity_name = "Branch assigned user delete";
          log.ceated_by = req.user.id;
          log.status = 0;
          auditLog.createAuditLog(log);
          return res.status(400).json({
            "err": `Cannot delete branch user Maybe branch was not found !`
          });
        }
      })
      .catch(err => {
        log.module_name = "Branch";
        log.activity_name = "Branch assigned user delete";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};
/*delete branch */
exports.branchUserAssign = function (req, res, next) {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.usersList.forEach(element => {
      element.created_by = req.user.id;
    });
    //insert multiple records fron the array to the contact users table 
    BranchUser.bulkCreate(req.body.usersList, {
      returning: true,
      individualHooks: true
    }).then(function (result) {
      log.module_name = "Branch";
      log.activity_name = "Users assigned to branch";
      log.ceated_by = req.user.id;
      log.status = 1;
      auditLog.createAuditLog(log);
      return res.status(200).json({
        "res": " Users assigned to branch uccessfully."
      });
    }).catch(err => {
      log.module_name = "Branch";
      log.activity_name = "Users assigned to branch";
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
    case 'branchCreate': {
      return [
        body('partnerId', "Partner Id doesn't exists").exists().isInt(),
        body('businessId', "Business Information  doesn't exists").exists().isInt({ gt: 0 }),
        body('branchName', "Branch name doesn't exists").exists().isString(),
        body('contactNo', "Contact number doesn't exists").exists().isLength({ min: 10, max: 12 }).withMessage('Contact No length should be minimum  10 and maximum 12'),
        body('address1', "Address-1 doesn't exists").exists().isString(),
        body('address2', "Address-2 doesn't exists").exists().isString(),
        body('address3', "address-3 doesn't exists").optional({ checkFalsy: true }).isString(),
        body('subrub', "subrub doesn't exists").exists().isString(),
        body('stateId', "State name doesn't exists").exists().isInt(),
        body('countryId', "Country name doesn't exists").exists().isInt(),
        body('postalCode', "Postel code doesn't exists").exists().isInt(),


      ]
    };
      break;
    case 'branchUpdate': {
      return [
        body('branchId', "Branch id doesn't exists").exists().isInt(),
        body('branchName', "Branch name doesn't exists").exists().isString(),
        body('contactNo', "Contact number doesn't exists").exists().isLength({ min: 10, max: 12 }).withMessage('Contact No length should be minimum  10 and maximum 12'),
        body('address1', "Address-1 doesn't exists").exists().isString(),
        body('address2', "Address-2 doesn't exists").exists().isString(),
        body('address3', "address-3 doesn't exists").optional({ checkFalsy: true }).isString(),
        body('subrub', "subrub doesn't exists").exists().isString(),
        body('stateId', "State name doesn't exists").exists().isInt(),
        body('countryId', "Country name doesn't exists").exists().isInt(),
        body('postalCode', "Postel code doesn't exists").exists().isInt(),


      ]
    };
      break;
    case 'branchStatusChange': {
      return [
        body('branchId', "Branch id doesn't exists").exists().isInt({ gt: 0 }),
        body('status', "status doesn't exists").exists().isInt({ lt: 2 })


      ]
    };
      break;
    case 'branchList': {
      return [

        body('partnerId', "Partner id doesn't exists").exists().isInt({ gt: 0 }),

      ]
    };
      break;
    case 'activeBranchesByPartner': {
      return [

        body('partnerId', "Partner id doesn't exists").exists().isInt({ gt: 0 }),

      ]
    };
      break;
    case 'branchUsersList': {
      return [

        body('branchId', "Branch id doesn't exists").exists().isInt({ gt: 0 })

      ]
    };
      break;
    case 'branchDelete': {
      return [
        body('branchId', "Branch id doesn't exists").exists().isInt({ gt: 0 }),



      ]
    };
      break;
    case 'branchUserDelete': {
      return [
        body('branchUserId', "Branch user id doesn't exists").exists().isInt({ gt: 0 }),



      ]
    };
      break;
  }
};
function getBranchCodesByBussinessId(businessId,methodType, brandName) {

  Branch.findAll({
    where: { business_id: businessId }

  }).then(branches => {
    let activeCodes = [];
    let inactiveCodes = [];
    branches.forEach(element => {
      if (!element.active || element.deleted) {
        inactiveCodes.push(element.code)
      }
      else activeCodes.push(element.code)

    });
    let requestData;
    if( methodType !== 'POST'){
       requestData = { PCRMBrandId: businessId.toString(), partnerCodes: activeCodes, brandName: brandName};
    }
   else requestData = { PCRMBrandId: businessId.toString(), activePartnerCodes: activeCodes, inactivePartnerCodes: inactiveCodes };
    const config = {
      method: methodType,
      url: dataUrl.requestUrl + '/wrbe/api/partnerCode',
      headers: {
        'Accept': 'application/json, text/plain, /',
        'Content-Type': 'application/json;charset=utf-8',
        'heimdallToken': dataUrl.heimdallToken
      },
      data: requestData
    }
    let status;
    return axios(config)
      .then(function (response) {
        console.log("responce", response);
        status = true;

      })
      .catch(function (error) {
        console.log("error", error)
        status = false;
      });


  })
    .catch(err => {
      console.log("err", err);
      //reject({ "err": err.message });
    });


}
function getBuinessName(businessId) {
  return new Promise((resolve, reject) => {
    BusinessInformation.findOne({
      where: { id: businessId }

    }).then(business => {
      let name = business.name
      resolve(name);
    })
      .catch(err => {
        reject({ "err": err.message });
      });


  })
}


function getBuinessIdByBranch(branchId) {
  return new Promise((resolve, reject) => {
    Branch.findOne({
      where: { id: branchId }

    }).then(branch => {
      let bussinessId = branch.business_id
      resolve(bussinessId);
    })
      .catch(err => {
        reject({ "err": err.message });
      });


  })
}
