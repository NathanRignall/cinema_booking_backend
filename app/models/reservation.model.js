module.exports = (sequelize, Sequelize) => {
  const Reservation = sequelize.define("reservation", {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    price: {
      type: Sequelize.INTEGER(3),
      allowNull: false,
      defaultValue: 0,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "N/A"
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "N/A"
    },
  });

  return Reservation;
};
