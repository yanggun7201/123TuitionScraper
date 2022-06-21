const { Sequelize, DataTypes, Model } = require('sequelize');

// https://www.newline.co/@AoX04/an-elegant-guide-to-sequelize-and-nodejs--1378842c

const sequelize = new Sequelize('database', global.DATABASE_USER_ID, global.DATABASE_USER_PASSWORD, {
  dialect: 'sqlite',
  // we will be saving our db as a file on this path
  storage: 'database-123tuition.sqlite', // or ':memory:'
});

module.exports = {
  sequelize
}
