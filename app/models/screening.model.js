module.exports = (sequelize, Sequelize) => {
  const Screening = sequelize.define("screening", {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER(5),
      allowNull: false,
    }
  });

  return Screening;
};
