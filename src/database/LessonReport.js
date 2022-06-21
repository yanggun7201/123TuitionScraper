const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('./db');

const LessonReport = sequelize.define('LessonReport', {
  // Here we define our model attributes
  // Each attribute will pair to a column in our database
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.NUMBER, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
  numberOfQuestions: { type: DataTypes.NUMBER, allowNull: false, defaultValue: 0 },
  numberOfCorrect: { type: DataTypes.NUMBER, allowNull: false, defaultValue: 0 },
  mark: { type: DataTypes.STRING },
  videoWatchedPercentage: { type: DataTypes.STRING },
  certificate: { type: DataTypes.STRING },
  totalTimeTakenMinSec: { type: DataTypes.STRING },
}, {
  // For the sake of clarity we specify our indexes
  indexes: [
    { unique: true, fields: ['id'] },
    { unique: false, fields: ['title', 'date', 'userId', 'userName'] },
  ]
});

// `sequelize.define` also returns the model
console.log(LessonReport === sequelize.models.LessonReport); // true

module.exports = {
  LessonReport,
  sequelize,
}