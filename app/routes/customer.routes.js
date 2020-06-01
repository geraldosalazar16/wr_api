const controller = require("../contollers/customer.controller");
const { authJwt } = require("../middleware");
const { customerVerify } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post('/api/customer/customercreate',[customerVerify.checkDuplicateCustomer,authJwt.verifyToken()], controller.validate('createCustomer'), controller.customerCreate);
  app.post('/api/customer/customerstatuschange', controller.validate('customerStatusChange'),[authJwt.verifyToken()], controller.customerStatusChange);
  app.post('/api/customer/customerupdate', controller.validate('updateCustomer'), [authJwt.verifyToken(), customerVerify.checkDuplicateCustomerOnUpdate], controller.customerUpdate);
  app.post('/api/customer/customerdetails', controller.validate('customerDetails'), [authJwt.verifyToken()], controller.customerDetails);
  app.post('/api/customer/customerbulkupload', controller.validate('customerBulkUpload'), [authJwt.verifyToken()], controller.customerCreateByCSV);
  app.post('/api/customer/customerlist', controller.validate('customersList'), [authJwt.verifyToken()], controller.customerListByBranchUser);
  app.post('/api/customer/customerlistbypartner', controller.validate('customersListByPartner'), [authJwt.verifyToken()], controller.customerListByPartnerGroup);
  app.post('/api/customer/customerdelete', controller.validate('customerDelete'),[authJwt.verifyToken()], controller.customerDelete);
  app.post('/api/customer/customerlistbybranch', controller.validate('customersListByBranch'), [authJwt.verifyToken()], controller.customerListByBranch);

};