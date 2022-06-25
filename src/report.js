const moment = require("moment");
const Sequelize = require('sequelize');
const { LessonReport, sequelize } = require('./database/LessonReport.js');
const { startOfDate, endOfDate } = require("./utils/dates");
const { getSelectBoxOptions, chooseOption, waitForNavigationAndAddScriptTags } = require("./utils/dom");
const { SUBJECT_SELECT_SELECTOR, COURSE_SELECT_SELECTOR } = require("./utils/constants");
const { delay } = require("./utils/common");
const { goToLessonReport } = require("./actions/goToLessonReport");
const { getCountWithStartDate, getTotalCount } = require("./services/LessonReportService");

const Op = Sequelize.Op;

/**
 *
 * @param page
 * @param student
 * @param subjectName Mathematics | Literacy | Mathematics Revision
 * @param fromDate
 * @param toDate
 * @returns {Promise<*>}
 */
async function collectReportTable(page, student, subjectName, fromDate, toDate) {

  return await page.evaluate((fromDate, toDate, subjectName, userId, userName) => {

    const fromDateMoment = moment(fromDate);
    const toDateMoment = moment(toDate);

    const parseTimestamp = (dateValue) => {
      const matches = dateValue.match(/document\.write\(getUserDateTime\((\d*)\)\).*/);
      if (matches?.[1] === undefined) {
        return new Date(0);
      }
      return new Date(Number(matches?.[1]));
    }

    const rows = Array.from(document.querySelector("#displaytag > tbody").querySelectorAll("tr"));
    const filteredRows = rows.filter(tr => {
      const columns = tr.querySelectorAll("td");

      // Date exists
      const dateValue = columns?.[1].textContent.trim();
      if (!dateValue) {
        return false;
      }

      const attemptDate = moment(parseTimestamp(dateValue).toISOString());
      return fromDateMoment.isSameOrBefore(attemptDate) && toDateMoment.isSameOrAfter(attemptDate);
    });

    return filteredRows.map(tr => {
      const columns = tr.querySelectorAll("td");
      return {
        userId,
        userName,
        subjectName,
        title: (columns[0].title ? columns[0].title.trim() : columns[0].textContent.trim()),
        date: moment(parseTimestamp(columns[1].textContent.trim())).toISOString(true),
        numberOfQuestions: columns[2].textContent.trim(),
        numberOfCorrect: columns[3].textContent.trim(),
        mark: columns[4].textContent.trim(),
        videoWatchedPercentage: columns[5].textContent.trim(),
        certificate: columns[6].textContent.trim(),
        totalTimeTakenMinSec: columns[7]?.textContent?.trim() ?? "00:00",
      }
    })

  }, fromDate, toDate, subjectName, student.id, student.name);
}

async function collectCurriculumAndSaveLessonReport(page, curriculums, j, student, subjects, i, fromDateISOString, toDateISOString) {
  await chooseOption(page, COURSE_SELECT_SELECTOR, curriculums[j].id);
  try {
    const reportData = await collectReportTable(page, student, subjects[i].name, fromDateISOString, toDateISOString);
    await saveLessonReports(reportData);
  } catch (e) {
    console.log(e);
  }
}

async function collectReport(page, student, fromDateISOString, toDateISOString) {

  // The following line will sync our models
  // To the database creating them or altering the db
  // To match the new model
  await sequelize.sync({ alter: true });

  const subjects = await getSelectBoxOptions(page, SUBJECT_SELECT_SELECTOR);
  console.log('____________________________student', student);

  for (let i = 0; i < subjects.length; i++) {
    await chooseOption(page, SUBJECT_SELECT_SELECTOR, subjects[i].id);
    await goToLessonReport(page);
    const curriculums = await getSelectBoxOptions(page, COURSE_SELECT_SELECTOR);

    for (let j = 0; j < curriculums.length; j++) {
      await collectCurriculumAndSaveLessonReport(page, curriculums, j, student, subjects, i, fromDateISOString, toDateISOString);
      await delay(1000);
    }
  }
}

async function printAllLessonReports() {
  const formattedToday = moment().toISOString(true).substring(0, 10);

  const count = await getCountWithStartDate(formattedToday)
  console.log(`today (${formattedToday}) count`, count);

  const totalCount = await getTotalCount();
  console.log(`total count`, totalCount);
}

async function saveLessonReports(reportData) {
  console.table(reportData);
  await printAllLessonReports();

  console.log("__________ start saving reports");
  for (let k = 0; k < reportData.length; k++) {
    const datum = reportData[k];
    const lessonReportModel = await LessonReport.findOne({
      where: {
        title: datum.title,
        date: datum.date,
        userId: datum.userId,
        userName: datum.userName,
      }
    });

    if (lessonReportModel && lessonReportModel.id) {
      // Do I really need to update the existing records?
      // console.log('__UPDATE datum:::', datum);
      // await LessonReport.update(
      //   // This object represent the fields
      //   // We are trying to update
      //   { ...datum },
      //   { where: { id: lessonReportModel.id } }
      // );
    } else {
      console.log('__INSERT new datum:::', datum);
      await LessonReport.build(datum).save();
    }
  }
  console.log("__________ end saving reports");
  await printAllLessonReports();
}

module.exports = {
  collectReport,
}
