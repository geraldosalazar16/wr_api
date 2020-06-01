const db = require("../models");
const { body } = require('express-validator/check')
const { validationResult } = require('express-validator/check');
const Customer = db.customer;
const ContactUser = db.contactUser;

const auditLog = require('./log.controller')
let log = {};
const moment = require('moment');




/** * create a cutomer based on baranch */
exports.customerCreate = function (req, res, next) {

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
    let customerCode =  req.body.customerName.substring(0,3) + a;
    //req.body.partnerId = parseInt(req.body.partnerId);
    //req.body.branchId = parseInt(req.body.branchId);
    req.body.countryId = parseInt(req.body.countryId);
    Customer.create({
      customer_id: customerCode,
      branch_id: req.body.branchId,
      company_id: req.user.company_id,
      title: req.body.customerTitle,
      name: req.body.customerName,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.customerEmail,
      contact_number: req.body.contactNo,
      date_of_birth: req.body.dateOfBirth,
      gender: req.body.gender,
      country_id: req.body.countryId,
      image: req.body.image,
      wr_subscription: req.body.wrSubscription,
      no_of_properties: req.body.noOfProperties,
      created_by: req.user.id
    })
      .then(customer => {
        if (customer) {
          log.module_name = "customer user adding";
          log.activity_name = "customer adding with wealth runner";
          log.ceated_by = req.user.id;
          log.status = 1;
          auditLog.createAuditLog(log);
          res.status(200).json({ "res": 'Customer added  successfully' });
        }
      })
      .catch(err => {
        log.module_name = "customer user adding";
        log.activity_name = "customer adding with wealth runner";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });

  }
};

/*Change customer  status */
exports.customerStatusChange = function (req, res, next) {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.customerId = parseInt(req.body.customerId);
    Customer.update({
      active: req.body.customerStatus,
      modified_by: req.user.id,
      updated_at: new Date()
    }, {
      where: { id: req.body.customerId },
      returning: true,
      plain: true
    })
      .then(function (result) {
        if (result[1] == 1) {
          log.module_name = "customers";
          log.activity_name = "customers status change";
          log.ceated_by = req.user.id;
          log.status = 1;
          auditLog.createAuditLog(log);
          return res.status(200).json({
            "res": "Customer status was changed successfully."
          });
        } else {
          log.module_name = "customers";
          log.activity_name = "customers status change";
          log.ceated_by = req.user.id;
          log.status = 0;
          auditLog.createAuditLog(log);
          return res.status(401).json({
            "err": `Cannot update Customer status Maybe customer was not found !`
          });
        }
      })
      .catch(err => {
        log.module_name = "customers";
        log.activity_name = "customers status change";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};

/** * create a cutomer based on baranch */
exports.customerUpdate = function (req, res, next) {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {

    req.body.countryId = parseInt(req.body.countryId);
    req.body.customerId = parseInt(req.body.customerId);
    Customer.update({
      title: req.body.customerTitle,
      name: req.body.customerName,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.customerEmail,
      contact_number: req.body.contactNo,
      date_of_birth: req.body.dateOfBirth,
      gender: req.body.gender,
      country_id: req.body.countryId,
      image: req.body.image,
      wr_subscription: req.body.wrSubscription,
      no_of_properties: req.body.noOfProperties,
      modified_by: req.user.id,
      updated_at: new Date()

    }, {
      where: { id: req.body.customerId },
      returning: true,
      plain: true
    })
      .then(function (result) {
        if (result[1] == 1) {
          log.module_name = "Customer";
          log.activity_name = "Customer update with wealth runner";
          log.ceated_by = req.user.id;
          log.status = 1;
          auditLog.createAuditLog(log);

          ContactUser.destroy({
            where: { customer_id: req.body.customerId }
          })
            .then(num => {
              let contactsList = [];
            if(req.body.contactsList.length >0) {
              req.body.contactsList.forEach(element => {
                if (element.firstName != '') {
                  let contact = {
                    customer_id: element.customerId,
                    first_name: element.firstName,
                    last_name: element.lastName,
                    email: element.email,
                    contact_number: element.contactno,
                    date_of_birth: element.dateOfBirth
                  }
                  contactsList.push(contact);
                }
                })
            }
         
                //insert multiple records fron the array to the contact users table 
                console.log(contactsList);
                ContactUser.bulkCreate(contactsList, {
                  returning: true,
                   individualHooks: true 
                }).then(function (result) {
                  return res.status(200).json({
                    "res": "Customer details updated successfully."
                  });
                }).catch(err => {
                  log.module_name = "Customer";
                  log.activity_name = "Customer update with wealth runner";
                  log.ceated_by = req.user.id;
                  log.status = 0;
                  auditLog.createAuditLog(log);
                  res.status(500).send({ "err": err.message });
                });
            })
            .catch(err => {
              res.status(500).send({
                message: "Could not update customer"
              });
            });
             


        } else {
          log.module_name = "Customer";
          log.activity_name = "Customer update with wealth runner";
          log.ceated_by = req.body.userId;
          log.status = 0;
          auditLog.createAuditLog(log);
          return res.status(401).json({
            "err": `Cannot updated customer Maybe customer was not found !`
          });
        }
      })
      .catch(err => {
        log.module_name = "Customer";
        log.activity_name = "Customer update with wealth runner";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });

  }
};
/*
get customer details*/
exports.customerDetails = function (req, res, next) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.customerId = parseInt(req.body.customerId);
    let customer = {
      details: {},
      contacts: []
    };
    Customer.findOne({  where: {
      id: req.body.customerId
    } }).then(function (customerData) {

      if (customerData) {
        customer.details = customerData;
        ContactUser.findAll({  where: {
          customer_id: req.body.customerId
        } })
          .then(function (contactUsers) {
            customer.contacts = contactUsers;
            log.module_name = "customer";
            log.activity_name = "customer details retriving";
            log.ceated_by = req.user.id;
            log.status = 1;
            auditLog.createAuditLog(log);
            return res.status(200).json(customer);
          })
          .catch(err => {
            log.module_name = "customer";
            log.activity_name = "customer details retriving";
            log.ceated_by = req.user.id;
            log.status = 0;
            auditLog.createAuditLog(log);
            res.status(500).send({ "err": err.message });
          });
      }
    })
      .catch(err => {
        log.module_name = "customer";
        log.activity_name = "customer details retriving";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};


/** * create a cutomer based on baranch by CSV uploade */
exports.customerCreateByCSV = function (req, res, next) {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    let customersList = [];
    req.body.customersList.forEach(element => {
      if(element['4']) {
        let a = Math.floor(100000 + Math.random() * 900000);   
        a = String(a);
        a = a.substring(0,4);
        let customerCode =  element['1'].substring(0,3) + a;
        let customer = {
          customer_id : customerCode,
          branch_id: req.body.branchId,
          company_id: req.user.company_id,
          title:  element['0'],
          name: element['1'],
          first_name: element['2'],
          last_name: element['3'],
          email: element['4'],
          contact_number: element['5'],
          date_of_birth: moment(new Date(element['6'])).format('YYYY-MM-DD'),
          gender: element['7'],
          country_id: 1,
          image: null,
          wr_subscription: element['8'] == 'No' ? 0 :1,
          no_of_properties: parseInt(element['9']),
          active: 1,
          created_by: req.user.id,
          modified_by: null,
          created_at: new Date(),
          updated_at: null,
          deleted: 0,
          deleted_by: null,
          deleted_at: null
          

        }
        customersList.push(customer);
      }
    });
      if (customersList.length >0 ) {
        Customer.bulkCreate(customersList, {
          returning: true,
          updateOnDuplicate: ["branch_id", "email"] 
        }).then(function (result) {
          log.module_name = "Customer";
          log.activity_name = "Customer list saved with wealth runner";
          log.ceated_by = req.user.id;
          log.status = 1;
          auditLog.createAuditLog(log);
          return res.status(200).json({
            "res": "Customer saved successfully."
          });
        }).catch(err => {
          log.module_name = "Customer";
          log.activity_name = "Customer list saved with wealth runner";
          log.ceated_by = req.user.id;
          log.status = 0;
          auditLog.createAuditLog(log);
          res.status(500).send({ "err": err.message });
        });
      }
    }
};

/*
get list of customers  based on partner Group  */
exports.customerListByPartnerGroup = function (req, res, next) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.partnerId = parseInt(req.body.partnerId);
    let customers = {};
    customers.list = [];
    Customer.findAll({  where: {
      company_id: req.body.partnerId, deleted: 0
    } })
      .then(function (customer) {
        customers.list = customer;
        log.module_name = "customer";
        log.activity_name = "customer list retriving";
        log.ceated_by = req.user.id;
        log.status = 1;
        auditLog.createAuditLog(log);
        return res.status(200).json(customers);
      })
      .catch(err => {
        log.module_name = "customer";
        log.activity_name = "customer list retriving";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};

/*
get list of customers  based on brnach user  */
exports.customerListByBranchUser = function (req, res, next) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.partnerId = parseInt(req.body.partnerId);
   // req.body.branchId = parseInt(req.body.branchId);
    let customers = {};
    customers.list = [];
    Customer.findAll({  where: {
      company_id: req.body.partnerId,branch_id :req.user.branch_id ,deleted: 0
    } })
      .then(function (customer) {
        customers.list = customer;
        log.module_name = "customer";
        log.activity_name = "customer list retriving";
        log.ceated_by = req.user.id;
        log.status = 1;
        auditLog.createAuditLog(log);
        return res.status(200).json(customers);
      })
      .catch(err => {
        log.module_name = "customer";
        log.activity_name = "customer list retriving";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};

/*delete customer */
exports.customerDelete = function (req, res, next) {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.customerId = parseInt(req.body.customerId);
    Customer.update({
      deleted: 1,
      deleted_by: req.user.id,
      deleted_at: new Date()
    }, {
      where: { id: req.body.customerId },
      returning: true,
      plain: true
    })
      .then(function (result) {
        if (result[1] == 1) {
          log.module_name = "customers";
          log.activity_name = "customer delete";
          log.ceated_by = req.user.id;
          log.status = 1;
          auditLog.createAuditLog(log);
          return res.status(200).json({
            "res": "Customer deleted successfully."
          });
        } else {
          log.module_name = "customers";
          log.activity_name = "customers delete";
          log.ceated_by = req.user.id;
          log.status = 0;
          auditLog.createAuditLog(log);
          return res.status(401).json({
            "err": `Cannot delete customer Maybe customer was not found !`
          });
        }
      })
      .catch(err => {
        log.module_name = "customers";
        log.activity_name = "customers delete";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};
/*
get list of customers  based on partner Group  */
exports.customerListByBranch = function (req, res, next) {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else {
    req.body.branchId = parseInt(req.body.branchId);
    let customers = {};
    customers.list = [];
    Customer.findAll({  where: {
      branch_id: req.body.branchId, deleted: 0
    } })
      .then(function (customer) {
        customers.list = customer;
        log.module_name = "customer";
        log.activity_name = "customer list retriving";
        log.ceated_by = req.user.id;
        log.status = 1;
        auditLog.createAuditLog(log);
        return res.status(200).json(customers);
      })
      .catch(err => {
        log.module_name = "customer";
        log.activity_name = "customer list retriving";
        log.ceated_by = req.user.id;
        log.status = 0;
        auditLog.createAuditLog(log);
        res.status(500).send({ "err": err.message });
      });
  }
};

/* express validators */
exports.validate = (method) => {
  switch (method) {
    case 'createCustomer': {
      return [
        body('branchId', "BranchId doesn't exists").exists().isInt({ gt: 0 }),
        body('customerName', "Customer Name doesn't exists").exists().isString(),
        body('customerTitle', "customer title doesn't exists").exists().isString(),
        body('firstName', "First name doesn't exists").exists().isString(),
        body('lastName', "Last name doesn't exists").exists().isString(),
        body('customerEmail', 'Please enter valid email').exists().isEmail(),
        body('contactNo', "Contact number doesn't exists").exists().isLength({ min:10,max: 12 }).withMessage('Contact No length should be minimum  10 and maximum 12'),
        body('dateOfBirth', "Date of Birth doesn't exists").exists().isString(),
        body('gender', "Gender doesn't exists").exists().isString(),
        body('countryId', "Country name doesn't exists").exists().isInt({ gt: 0 }),
        body('noOfProperties', "No of properties doesn't exists").exists().isInt({ gt: 0 }),
        body('wrSubscription', "Subscription doesn't exists").exists().isBoolean(),
        body('image', "image doesn't exists").optional({ checkFalsy: true }),

      ]
    };
      break;
    case 'updateCustomer': {
      return [
        body('customerId', "Customer Id doesn't exists").exists().isInt({ gt: 0 }),
        body('customerTitle', "customer title doesn't exists").exists().isString(),
        body('customerName', "Customer Name doesn't exists").exists().isString(),
        body('firstName', "First name doesn't exists").exists().isString(),
        body('lastName', "Last name doesn't exists").exists().isString(),
        body('customerEmail', 'Please enter valid email').exists().isEmail(),
        body('contactNo', "Contact number doesn't exists").exists().isLength({ min:10,max: 12 }).withMessage('Contact No length should be minimum  10 and maximum 12'),
        body('dateOfBirth', "Date of Birth doesn't exists").exists().isString(),
        body('gender', "Gender doesn't exists").exists().isString(),
        body('countryId', "Country name doesn't exists").exists().isInt({ gt: 0 }),
        body('noOfProperties', "No of properties doesn't exists").exists().isInt({ gt: 0 }),
        body('wrSubscription', "Subscription doesn't exists").exists().isBoolean(),
        body('image', "image doesn't exists").optional({ checkFalsy: true }).isString(),
        body('contactsList', "Contacts list doesn't exists").optional({ checkFalsy: true }).isArray(),


      ]
    };
      break;

    case 'customersList': {
      return [
        body('partnerId', "Partner Id doesn't exists").exists().isInt({ gt: 0 }),
       // body('branchId', "Branch Id doesn't exists").exists().isInt({ gt: 0 }),
      ]
    };
      break;
    case 'customersListByPartner': {
      return [
        body('partnerId', "Partner Id doesn't exists").exists().isInt({ gt: 0 }),



      ]
    };
      break;
    case 'customerStatusChange': {
      return [
        body('customerId', "Customer Id doesn't exists").exists().isInt({ gt: 0 }),
        body('customerStatus', "status doesn't exists").exists().isInt({ lt: 2 })
      ]
    };
      break;
    case 'addCustomersContacts': {
      return [
        body('customerId', "Customer Id doesn't exists").exists().isInt({ gt: 0 }),
        body('firstName', "First name doesn't exists").exists().isString(),
        body('lastName', "Last name doesn't exists").exists().isString(),
        body('customerEmail', 'Please enter valid email').exists().isEmail(),
        body('contactNo', "Contact number doesn't exists").exists().isLength({ min:10,max: 12 }).withMessage('Contact No length should be minimum  10 and maximum 12'),
        body('dateOfBirth', "Date of Birth doesn't exists").exists().isString(),
      ]
    };
      break;
    case 'customerContactStatusChange': {
      return [
        body('contactId', "Contact Id doesn't exists").exists().isInt({ gt: 0 }),
        body('contactStatus', "status doesn't exists").exists().isInt({ lt: 2 })
      ]
    };
      break;
    case 'customerBulkUpload': {
      return [
        body('customersList', "Customers list doesn't exists").optional({ checkFalsy: true }).isArray(),

      ]
    };
      break;
    case 'customerDetails': {
      return [
        body('customerId', "Customer Id doesn't exists").exists().isInt({ gt: 0 }),

      ]
    };
      break;
      case 'customerDelete': {
        return [
          body('customerId', "Customer Id doesn't exists").exists().isInt({ gt: 0 }),
        ]
      };
        break;
        case 'customersListByBranch': {
          return [
            body('branchId', "Branch Id doesn't exists").exists().isInt({ gt: 0 }),
    
    
    
          ]
        };
          break;

  }
};