const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// import the models to the system
db.users = require("./user.model.js")(sequelize, Sequelize);
db.employees = require("./employee.model.js")(sequelize, Sequelize);

db.purchases = require("./purchase.model.js")(sequelize, Sequelize);
db.reservations = require("./reservation.model.js")(sequelize, Sequelize);
db.screens = require("./screen.model.js")(sequelize, Sequelize);
db.seats = require("./seat.model.js")(sequelize, Sequelize);
db.movies = require("./movie.model.js")(sequelize, Sequelize);
db.screenings = require("./screening.model.js")(sequelize, Sequelize);

// create the realtionship between purchases and reservations (one to many)
db.purchases.hasMany(db.reservations, { as: "reservations" });
db.reservations.belongsTo(db.purchases, { foreignKey: "purchaseId", as: "purchase" });

// create the realtionship between screens and seets (one to many)
db.screens.hasMany(db.seats, { as: "seats" });
db.seats.belongsTo(db.screens, { foreignKey: "screenId", as: "screen" });

// create the realtionship between movies and screenings (one to many)
db.movies.hasMany(db.screenings, { as: "screenings" });
db.screenings.belongsTo(db.movies, { foreignKey: "movieId", as: "movie" });

// create the realtionship between screenings and seets (one to many)
db.screens.hasMany(db.screenings, { as: "screening" });
db.screenings.belongsTo(db.screens, { foreignKey: "screenId", as: "screen" });

// create the relationship between seats and screenings via reservations (many to many)
db.seats.belongsToMany(db.screenings, { through: db.reservations });
db.screenings.belongsToMany(db.seats, { through: db.reservations });

// export the whole db model formed
module.exports = db;
