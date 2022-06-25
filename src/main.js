const moment = require("moment");
const { delay } = require("./utils/common");
const { getSelectBoxOptions, chooseOption } = require("./utils/dom");
const { login } = require("./actions/login");
const { launchBrowser } = require("./utils/browser");
const { startOfDate, endOfDate } = require("./utils/dates");
const { STUDENT_SELECT_SELECTOR } = require("./utils/constants");
const { collectReport } = require("./report");
const { goToReport } = require("./actions/goToReport");
const { sendReminderMessage: sendSummaryMessage } = require("./actions/sendReminderMessage");
const { getReportSummary } = require("./actions/reportSummary");

require("dotenv").config();

global.LOGIN_ID = process.env.LOGIN_ID;
global.LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
global.ROOT_DIR = __dirname;

const runProcess = async () => {
  let browser = null;

  try {
    browser = await launchBrowser();
    const page = await browser.newPage();

    await login(page);
    await goToReport(page);
    const students = await getSelectBoxOptions(page, STUDENT_SELECT_SELECTOR);

    const startPeriod = startOfDate(moment().day("Sunday"));
    const endPeriod = endOfDate(moment(startPeriod).add(6, "days")); // 6

    const fromDateISOString = startPeriod.toISOString(true);
    const toDateISOString = endPeriod.toISOString(true);

    console.log('____________________________fromDate ~ toDate', fromDateISOString, "~", toDateISOString);

    for (let i = 0; i < students.length; i++) {
      await chooseOption(page, STUDENT_SELECT_SELECTOR, students[i].id);
      await collectReport(page, students[i], fromDateISOString, toDateISOString);
      await delay(5000);
    }

    const reportSummary = await getReportSummary();
    await sendSummaryMessage(page, reportSummary);
    console.log('____________________________fromDate ~ toDate', fromDateISOString, "~", toDateISOString);
  } catch (e) {
    console.log("runProcess()", e);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

}

// (async function () {
//   console.log(`process.env.NODE_ENV = "${process.env.NODE_ENV}" - ${new Date()}`);
//   // reStartDailyOutcome();
//
//   console.log('process.argv', process.argv);
//
//   const arguments = process.argv.slice(2);
//   console.log('arguments', arguments);
//
//   const startPeriod = startOfDate(moment().day("Sunday"));
//   const endPeriod = endOfDate(moment(startPeriod).add(6, "days")); // 6
//   console.log('startPeriod', startPeriod);
//   console.log('endPeriod', endPeriod);
//   await runProcess();
//   console.info(`\n\n\n${new Date()} #####  Done  #####\n\n\n`);
// })();

module.exports = {
  main: async function () {
    console.time("Elapsed time:");
    console.log(`process.env.NODE_ENV = "${process.env.NODE_ENV}" - ${new Date()}`);
    // reStartDailyOutcome();

    console.log('process.argv', process.argv);

    const arguments = process.argv.slice(2);
    console.log('arguments', arguments);

    await runProcess();
    console.info(`\n\n\n${new Date()} #####  Done  #####\n\n\n`);
    console.timeEnd("Elapsed time:");
  }
}
