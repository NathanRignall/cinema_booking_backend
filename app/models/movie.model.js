module.exports = (sequelize, Sequelize) => {
    const Movie = sequelize.define("movie", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER(3),
        allowNull: false,
      }
    });
  
    return Movie;
  };