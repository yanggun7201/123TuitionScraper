require("dotenv").config();

global.LOGIN_ID = process.env.LOGIN_ID;
global.LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
global.ROOT_DIR = __dirname;
global.DATABASE_USER_ID = process.env.DATABASE_USER_ID;
global.DATABASE_USER_PASSWORD = process.env.DATABASE_USER_PASSWORD;
global.KAKAO_JAVASCRIPT_KEY = process.env.KAKAO_JAVASCRIPT_KEY;
global.SLACK_TOKEN = process.env.SLACK_TOKEN;
global.SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;
global.USE_SLACK = process.env.USE_SLACK;

const { main } = require("./main");

(async function () {
  await main();
})();
