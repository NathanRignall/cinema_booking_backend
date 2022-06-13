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
    cost: {
      type: Sequelize.INTEGER(8),
      allowNull: false,
    },
    online: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    entered: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  return Purchase;
};
