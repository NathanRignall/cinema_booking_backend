module.exports = (sequelize, Sequelize) => {
  const Purchase = sequelize.define("purchases", {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    paid: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });

  return Purchase;
};
