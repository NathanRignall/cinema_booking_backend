module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define("employee", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hash: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      }
    });
  
    return Employee;
  };