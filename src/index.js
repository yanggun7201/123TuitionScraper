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
global.HEADLESS = process.env.HEADLESS;

const { main : run } = require("./main");

async function main() {
  await run();
}

main();

const retryTimeout = parseInt(process.env.RETRY_TIMEOUT_MINUTES || "5", 10) * 60;
console.log("RETRY_TIMEOUT_SECONDS", retryTimeout);

setInterval(main, retryTimeout * 1000);
