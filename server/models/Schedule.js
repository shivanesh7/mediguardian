const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patientId: {
    type: DataTypes.STRING(128),
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  hospitalId: {
    type: DataTypes.STRING(128),
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  medicationName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('medicine', 'injection', 'vaccine'),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  timeSlots: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  adherenceRecord: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  instructions: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  timestamps: true
});

module.exports = Schedule;
