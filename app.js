/**
 * Main application file
 */

'use strict';
// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require('morgan');
const compression = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
const path = require('path');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const responseTime = require('response-time')
const expressValidator = require('express-validator');
const session    = require('express-session')
const config = require("./config/auth.config");
const app = express();
const corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '50mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}));
const env = app.get('env');
   app.use(expressValidator())
  app.use(compression());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(fileUpload());
  app.use(responseTime());
    app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
   
  }));
  const db = require("./app/models");
//db.sequelize.sync();
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Wealth Runner application." });
});
//include all routes here 

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/branch.routes')(app);
require('./app/routes/customer.routes')(app);
require('./app/routes/designation.routes')(app);
require('./app/routes/state.routes')(app);
require('./app/routes/businessinformation.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
if ('production' === env) {
  app.use(morgan('dev'));
}

if ('development' === env || 'test' === env) {
  app.use(require('connect-livereload')());
  app.use(morgan('dev'));
  app.use(errorHandler()); // Error handler - has to be last
}