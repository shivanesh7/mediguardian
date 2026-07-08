const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(128),
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('hospital', 'patient', 'caregiver'),
    allowNull: false
  },
  caregiverId: {
    type: DataTypes.STRING(128),
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  hospitalId: {
    type: DataTypes.STRING(128),
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  timestamps: true
});

module.exports = User;
