module.exports = (sequelize, Sequelize) => {
    const Seat = sequelize.define("seat", {
      id: {
        primaryKey: true,
        type: Sequelize.CHAR(42),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avaliable: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    });
  
    return Seat;
  };