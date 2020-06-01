const { verifySignUp } = require("../middleware");
const controller = require("../contollers/user.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/user/userscreate",[
    verifySignUp.checkDuplicateUsernameOrEmail,
  ], controller.validate('createUser'), controller.usersCreate);
  app.post("/api/user/userstatuschange",[authJwt.verifyToken()],controller.validate('userStatusChange'), controller.changeUserStatus);
  app.post("/api/user/deleteuser",[authJwt.verifyToken()],controller.validate('userDelete'), controller.userDelete);
  app.post('/api/user/passwordchange', controller.validate('passwordChange'), controller.userPasswordChange);
  app.post('/api/user/usersprofileupdate',[verifySignUp.checkDuplicateEmailOnUpdate,authJwt.verifyToken()], controller.validate('userProfileUpdate'), controller.usersProfileUpdate);
  app.post('/api/user/checkemail', controller.validate('checkEmail'), controller.checkEmail);
  app.post('/api/user/checkusername', controller.validate('checkUsername'), controller.checkUserName);
  app.post('/api/user/branchusercreate', [verifySignUp.checkDuplicateUsernameOrEmail,authJwt.verifyToken()], controller.validate('createBranchUser'), controller.createBranchUser);
  app.post('/api/user/branchuserupdate', [verifySignUp.checkDuplicateEmailOnUpdate,authJwt.verifyToken()], controller.validate('updateBranchUser'), controller.branchUserUpdate);
  app.post('/api/user/changeusername', [verifySignUp.checkDuplicateUsernameOrEmail,authJwt.verifyToken()], controller.validate('changeUserName'), controller.changeUserName);
  app.post('/api/user/forgotpassword', controller.validate('verifyAccount'), controller.changePasswordThroughLink);
  app.post('/api/user/forgotpasswordlink', controller.validate('forgotPasssword'), controller.forgotPasswordLink);
  app.post('/api/user/userverification', controller.validate('verifyAccount'), controller.verifyuserAccount);
  app.post('/api/user/userslist', controller.listOfHeadOffices);
  app.post('/api/user/companyuserslist', [authJwt.verifyToken()], controller.usersListByCompany);
  app.post('/api/user/userbrancheslist', [authJwt.verifyToken()], controller.validate('branchesList'), controller.branchesListByUser);

};