require("dotenv").config();

global.LOGIN_ID = process.env.LOGIN_ID;
global.LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
global.ROOT_DIR = __dirname;

const { main } = require("./main");
main();