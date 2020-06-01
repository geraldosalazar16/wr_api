const controller = require("../contollers/branch.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post('/api/branch/branchcreate', [authJwt.verifyToken()], controller.validate('branchCreate'), controller.createBranch);
  app.post('/api/branch/branchupdate', [authJwt.verifyToken()], controller.validate('branchUpdate'), controller.updateBranch);
  app.post('/api/branch/branchstatuschange',[authJwt.verifyToken()], controller.validate('branchStatusChange'), controller.branchStausChange);
  app.post('/api/branch/brancheslist',[authJwt.verifyToken()], controller.validate('branchList'), controller.branchListByCompany);
  app.post('/api/branch/branchuserslist', [authJwt.verifyToken()], controller.validate('branchUsersList'), controller.usersListByBranch);
  app.post('/api/branch/activebranches', [authJwt.verifyToken()], controller.validate('activeBranchesByPartner'), controller.activeBranchesList);
  app.post('/api/branch/branchdelete', [authJwt.verifyToken()], controller.validate('branchDelete'), controller.branchDelete);
  app.post('/api/branch/branchuserdelete', [authJwt.verifyToken()], controller.validate('branchUserDelete'), controller.branchUserDelete);
  app.post('/api/branch/branchuserassign', [authJwt.verifyToken()], controller.branchUserAssign);

};