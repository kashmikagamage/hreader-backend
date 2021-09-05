const Sequelize = require("sequelize");



db = new Sequelize("test", "root", "1234", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  dialectOptions: {
    // useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: true,
    timezone: "+05:30",
  },
  timezone: "+05:30", //for writing to database
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});


db.sync({ force: false }).then(() => {

});
module.exports = db;
