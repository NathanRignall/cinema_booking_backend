module.exports = (sequelize, Sequelize) => {
    const Screen = sequelize.define("screen", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      totalSeats: {
        type: Sequelize.INTEGER(4),
        allowNull: false
      }
    });
  
    return Screen;
  };