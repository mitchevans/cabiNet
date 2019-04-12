module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define("Item", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    perishable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    expiration: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    expiration_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    when_obtained: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_type: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  return Item;
};
