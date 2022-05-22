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
  });

  return Screening;
};
