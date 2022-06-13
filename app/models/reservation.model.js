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
    seatName: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "N/A"
    },
    typeName: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "N/A"
    },
    profileName: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "N/A"
    },
  });

  return Reservation;
};
