const controller = require("../contollers/businessinformation.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post('/api/business/getbusinessinfrormation', controller.getBusinessInforamtionList);

};