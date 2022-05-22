module.exports = (sequelize, Sequelize) => {
    const Seat = sequelize.define("seat", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      x: {
        type: Sequelize.INTEGER(2),
      },
      y: {
        type: Sequelize.INTEGER(2),
      }
    });
  
    return Seat;
  };