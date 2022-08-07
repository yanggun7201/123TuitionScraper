const moment = require("moment");
const { groupBy } = require("lodash");
const { getDateRange} = require("../utils/dates");
const { DAY_OF_WEEK } = require("../utils/constants");
const { findAll } = require("../services/LessonReportService");

function getPassCount(reports) {
  // Gold, Silver, Bronze, N/A(Assessment)
  const groupedByTitle = groupBy(reports, "title");

  let subjectPassCount = 0;
  for(const [_, reportsData] of Object.entries(groupedByTitle)) {
    // if (reportsData.length > 2 || reportsData?.[0]?.certificate) {
    //   subjectPassCount ++;
    // }
    if (reportsData?.[0]?.certificate > '') {
      subjectPassCount ++;
    }
  }

  return subjectPassCount;
}

function mapReportByDayOfWeek(reportsByDay, targetMomentDate) {
  // https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/
  const targetDate = targetMomentDate.format("YYYY-MM-DD");
  const date = targetMomentDate.format("DD");

  const result = {
    date,
    mathTryCount: 0,
    mathPassCount: 0,
    englishTryCount: 0,
    englishPassCount: 0,
  }

  if (reportsByDay[targetDate]) {
    return {
      ...result,
      mathTryCount: reportsByDay[targetDate].filter(report => report.subjectName === "Mathematics").length,
      mathPassCount: getPassCount(reportsByDay[targetDate].filter(report => report.subjectName === "Mathematics")),
      englishTryCount: reportsByDay[targetDate].filter(report => report.subjectName === "Literacy").length,
      englishPassCount: getPassCount(reportsByDay[targetDate].filter(report => report.subjectName === "Literacy")),
    }
  }

  return result;
}

async function getReportSummary() {

  const [startPeriod, endPeriod] = getDateRange();
  const fromDateISOString = startPeriod.toISOString(true);
  const toDateISOString = endPeriod.toISOString(true);

  const list = await findAll(fromDateISOString, toDateISOString);
  const reportsByUser = groupBy(list, "userName");
  const userResults = [];

  for (const [userName, reports] of Object.entries(reportsByUser)) {
    const reportsByDay = groupBy(
      reports.filter(item => item.certificate),
      report => report.date.substring(0, 10)
    );
    const userResult = {};

    DAY_OF_WEEK.map((dayOfWeekText, index) => {
      userResult[dayOfWeekText] = mapReportByDayOfWeek(
        reportsByDay,
        moment(startPeriod).add(index, "days")
      );
    });

    userResults.push({
      userName,
      totalMathPass: Object.values(userResult).map(result => result.mathPassCount).reduce((sum, currentValue) => sum + (currentValue||0), 0),
      totalEnglishPass: Object.values(userResult).map(result => result.englishPassCount).reduce((sum, currentValue) => sum + (currentValue||0), 0),
      result: userResult
    });
  }// for

  return userResults;
}

module.exports = {
  getReportSummary
}
