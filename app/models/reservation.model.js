module.exports = (sequelize, Sequelize) => {
  const Reservation = sequelize.define("reservation", {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    paid: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });

  return Reservation;
};
