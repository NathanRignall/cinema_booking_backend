module.exports = (sequelize, Sequelize) => {
    const Seat = sequelize.define("seat", {
      id: {
        primaryKey: true,
        type: Sequelize.CHAR(42),
      },
      avaliable: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    });
  
    return Seat;
  };