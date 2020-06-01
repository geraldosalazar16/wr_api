const dbConfig = require("../../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  define: {
    timestamps: false
},
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }

});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.country = require("./country.model")(sequelize, Sequelize);
db.state = require("./state.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.patnerGroup = require("./patnergroup.model")(sequelize, Sequelize);
db.designation = require("./designation.model")(sequelize, Sequelize);
db.businessInformation = require("./businessinformation.model")(sequelize, Sequelize);
db.user = require("./user.model")(sequelize, Sequelize);
db.branch = require("./branch.model")(sequelize, Sequelize);
db.customer = require("./customer.model")(sequelize, Sequelize);
db.verificatioToken = require("./verificationtoken.model")(sequelize, Sequelize);
db.contactUser = require("./contactuser.model")(sequelize, Sequelize);
db.customerSubscription = require("./customersubscription.model")(sequelize, Sequelize);
db.auditLog = require("./auditlog.model")(sequelize, Sequelize);
db.branchUser = require("./branchuser.model")(sequelize, Sequelize);


// Relations 
// db.roles.hasMany(db.users);
// db.states.hasMany(db.users);
// db.countries.hasMany(db.users);
// db.designations.hasMany(db.users);
 //db.patnerGroups.hasMany(db.users);
// db.users.hasMany(db.users);
// db.users.belongsTo(db.users);
// db.users.belongsTo(db.countries);
// db.users.belongsTo(db.states);
// db.users.belongsTo(db.roles);
// db.countries.hasMany(db.states);
// db.states.belongsTo(db.countries);
// db.patnerGroups.hasMany(db.designations);
// db.designations.belongsTo(db.patnerGroups);

db.user.hasMany(db.branchUser, {foreignKey: 'user_id'})
db.branchUser.belongsTo(db.user, {foreignKey: 'user_id'})
db.branch.hasMany(db.branchUser, {foreignKey: 'branch_id'})
db.branchUser.belongsTo(db.branch, {foreignKey: 'branch_id'})

module.exports = db;