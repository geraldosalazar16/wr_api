const db = require("../models");
const BusinessInformation = db.businessInformation;
const Sequelize = require("sequelize");


/*
get list of business informations  */
exports.getBusinessInforamtionList = function (req, res, next) {
  let informationList = [];

  BusinessInformation.findAll({
    where: {
      id: {
        [Sequelize.Op.notIn]: Sequelize.literal(`(select business_id from users)`)
      }, active: 1
    }
  }
  ).then(function (informations) {
    informationList = informations;
    return res.status(200).json(informationList);
  })
    .catch(err => {
      return res.status(500).send({ "err": err.message });
    });

};


