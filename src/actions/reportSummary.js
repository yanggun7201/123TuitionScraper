const moment = require("moment");
const { groupBy } = require("lodash");
const { startOfDate, endOfDate } = require("../utils/dates");
const { DAY_OF_WEEK } = require("../utils/constants");
const { findAll } = require("../services/LessonReportService");

function getSubjectCount(reports, subject) {
  return reports.filter(report => report.subjectName === subject).length;
}

function isSubjectPass(reports, subject) {
  // Gold, Silver, Bronze, N/A(Assessment)
  return reports.filter(report => report.subjectName === subject).some(report => report.certificate);
}

function mapReportByDayOfWeek(reportsByDay, targetMomentDate) {
  // https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/
  const targetDate = targetMomentDate.format("YYYY-MM-DD");
  const date = targetMomentDate.format("DD");

  let result = {
    date: date,
    mathCount: 0,
    mathPass: false,
    englishCount: 0,
    englishPass: false,
  }

  if (reportsByDay[targetDate]) {
    result = {
      ...result,
      mathCount: getSubjectCount(reportsByDay[targetDate], "Mathematics"),
      mathPass: isSubjectPass(reportsByDay[targetDate], "Mathematics"),
      englishCount: getSubjectCount(reportsByDay[targetDate], "Literacy"),
      englishPass: isSubjectPass(reportsByDay[targetDate], "Literacy"),
    }
  }

  return result;
}

async function getReportSummary() {

  const startPeriod = startOfDate(moment().day("Sunday"));
  const endPeriod = endOfDate(moment(startPeriod).add(6, "days")); // 6
  const fromDateISOString = startPeriod.toISOString(true);
  const toDateISOString = endPeriod.toISOString(true);

  const list = await findAll(fromDateISOString, toDateISOString);
  const reportsByUser = groupBy(list, "userName");
  const userResults = [];

  for (const [userName, reports] of Object.entries(reportsByUser)) {
    const reportsByDay = groupBy(reports, report => report.date.substring(0, 10));
    const userResult = {};

    DAY_OF_WEEK.map((dayOfWeekText, index) => {
      userResult[dayOfWeekText] = mapReportByDayOfWeek(
        reportsByDay,
        moment(startPeriod).add(index, "days")
      );
    });

    userResults.push({
      userName,
      totalMathPass: Object.values(userResult).filter(result => result.mathPass || result.mathCount > 1).length,
      totalEnglishPass: Object.values(userResult).filter(result => result.englishPass || result.englishCount > 1).length,
      result: userResult
    });
  }// for

  return userResults;
}

module.exports = {
  getReportSummary
}
