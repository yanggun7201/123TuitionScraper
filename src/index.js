require("dotenv").config();

global.LOGIN_ID = process.env.LOGIN_ID;
global.LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
global.ROOT_DIR = __dirname;
global.DATABASE_USER_ID = process.env.DATABASE_USER_ID;
global.DATABASE_USER_PASSWORD = process.env.DATABASE_USER_PASSWORD;

const { main } = require("./main");
main();