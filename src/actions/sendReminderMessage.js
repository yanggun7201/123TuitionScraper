const {
  DAY_OF_WEEK,
  DOLLAR_PER_MODULE,
} = require("../utils/constants");
const { loadKakaoScript, initKakaoAPI, sendKakaoMessage } = require("./sendKakaoMessage");
const { sendSlackMessage } = require("./sendSlackMessage");
const moment = require("moment");

function getCountAndPass(reportSummary, fieldPrefix) {
  return `${reportSummary[fieldPrefix + "TryCount"]}(${reportSummary[fieldPrefix + "PassCount"] ? "O" : "X"})`;
}

async function generateMessage(reportSummary) {
  const mathTotalDollar = reportSummary.totalMathPass * DOLLAR_PER_MODULE;
  const englishTotalDollar = reportSummary.totalEnglishPass * DOLLAR_PER_MODULE;
  const everydayResult = DAY_OF_WEEK.map(dayOfWeek => {
    return (`${dayOfWeek}(${reportSummary.result[dayOfWeek].date}) 수학:${getCountAndPass(reportSummary.result[dayOfWeek], "math")}, 영어:${getCountAndPass(reportSummary.result[dayOfWeek], "english")}`)
  }).join("\n");

  return `
${reportSummary.userName}
${everydayResult}
======================
수학: ${reportSummary.totalMathPass}회 => $${mathTotalDollar}
영어: ${reportSummary.totalEnglishPass}회 => $${englishTotalDollar}
`;

//   기본: $${DEFAULT_ALLOWANCE}
// ==================
//   보너스 성공: $${DEFAULT_ALLOWANCE} + ($${mathTotalDollar} + $${englishTotalDollar}) + $${SUCCESS_BONUS} = $${DEFAULT_ALLOWANCE + mathTotalDollar + englishTotalDollar + SUCCESS_BONUS}
//   보너스 실패: $${DEFAULT_ALLOWANCE} + ($${mathTotalDollar} + $${englishTotalDollar}) + $${0} = $${DEFAULT_ALLOWANCE + mathTotalDollar + englishTotalDollar}

}

async function sendReminderMessageThroughSlack(reportSummary) {

  console.log("Slack start");
  await sendSlackMessage(":heart::heart::heart::heart::heart::heart::");
  await sendSlackMessage(`123Tuition ${moment().toISOString(true)}`);

  for (let i = 0; i < reportSummary.length; i++) {
    const message = await generateMessage(reportSummary[i]);
    await sendSlackMessage(message.trim());
  }
  console.log("Slack end");
}

async function sendReminderMessage(page, reportSummary) {

  if (global.USE_SLACK) {
    await sendReminderMessageThroughSlack(reportSummary);
    return;
  }

  console.log("Kakao start");
  await loadKakaoScript(page);
  const isInit = await initKakaoAPI(page);

  if (!isInit) {
    throw new Error("Kakao initialize failed.")
  }


  for (let i = 0; i < reportSummary.length; i++) {
    const message = await generateMessage(reportSummary[i]);
    console.log('message', message);
    await sendKakaoMessage(page, message.trim());
  }

  console.log("Kakao end");
}

module.exports = {
  sendReminderMessage
}
