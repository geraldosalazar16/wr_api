module.exports = {
    HOST: "db4free.net",
    USER: "wealth",
    PASSWORD: "Password@123",
    DB: "wealth",
    dialect: "mysql",
    port: 3306,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000000,
      idle: 10000
    }
  };