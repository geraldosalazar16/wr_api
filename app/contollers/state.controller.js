const db = require("../models");
const { body } = require('express-validator/check')
const { validationResult } = require('express-validator/check');
const State = db.state;



/*
get list of states based on coutry  */
exports.getStatesByCountry = function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    else {

        req.body.countryId = parseInt(req.body.countryId);
        let states = [];
        State.findAll({ where: { country_id : req.body.countryId }}).then(function (state) {
            states = state;
            return res.status(200).json(states);
          })
          .catch(err => {
            res.status(500).send({ "err": err.message });
          });
    }
};

  
exports.validate = (method) => {
    switch (method) {
      case 'statesList': {
        return [
          body('countryId', "coutryId doesn't exists").exists().isInt({ gt: 0 }),
        ]
      };
        break;
  
    }
  };