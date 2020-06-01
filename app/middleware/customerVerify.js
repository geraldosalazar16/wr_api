const db = require("../models");
const Customer = db.customer;

checkDuplicateCustomer = (req, res, next) => {
  
    // const customerCondition = [
    //     { branch_id: req.body.branchId, email: req.body.customerEmail },
  
    //   ];
  Customer.findOne({ where: { branch_id: req.body.branchId, email: req.body.customerEmail, deleted: 0 } }).then(customer => {
    if (customer) {
      res.status(400).send({
        err: "Failed customer is already in use in this branch"
      });
      return;
    }
      next();
  });
};

checkDuplicateCustomerOnUpdate = (req, res, next) => {
  
  // const customerCondition = [
  //     { branch_id: req.body.branchId, email: req.body.customerEmail },

  //   ];
Customer.findOne({ where: { branch_id: req.body.branchId, email: req.body.customerEmail, deleted: 0,  id: { $not: req.body.customerId}  } }).then(customer => {
  if (customer) {
    res.status(400).send({
      err: "Failed customer email is already in use in this branch"
    });
    return;
  }
    next();
});
};



const customerVerify = {
    checkDuplicateCustomer: checkDuplicateCustomer,
    checkDuplicateCustomerOnUpdate: checkDuplicateCustomerOnUpdate,

};

module.exports = customerVerify;