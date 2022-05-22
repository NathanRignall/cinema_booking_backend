module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define("profile", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER(3),
        allowNull: false,
      }
    });
  
    return Profile;
  };