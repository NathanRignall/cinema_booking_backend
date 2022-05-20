module.exports = (sequelize, Sequelize) => {
    const Type = sequelize.define("type", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  
    return Type;
  };