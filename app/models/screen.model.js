module.exports = (sequelize, Sequelize) => {
    const Screen = sequelize.define("screen", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      columns: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
      },
    });
  
    return Screen;
  };