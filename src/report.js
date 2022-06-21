const moment = require("moment");
const { startOfDate, endOfDate } = require("./utils/dates");
const { getSelectBoxOptions, chooseOption, waitForNavigationAndAddScriptTags } = require("./utils/dom");
const { SUBJECT_SELECT_SELECTOR, COURSE_SELECT_SELECTOR } = require("./utils/constants");
const { delay } = require("./utils/common");
const { goToLessonReport } = require("./actions/goToLessonReport");


async function collectReportTable(page, fromDate, toDate) {

  return await page.evaluate((fromDate, toDate) => {
    console.log('filterDate', fromDate, toDate);
    console.log('moment', window.moment());

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

      console.log('dateValue', dateValue);
      console.log('parseTimestamp(dateValue)', parseTimestamp(dateValue));
      console.log('parseTimestamp(dateValue).toISOString()', parseTimestamp(dateValue).toISOString());
      const attemptDate = moment(parseTimestamp(dateValue).toISOString());
      return fromDateMoment.isSameOrBefore(attemptDate) && toDateMoment.isSameOrAfter(attemptDate);
    });

    return filteredRows.map(tr => {
      const columns = tr.querySelectorAll("td");
      return {
        title: columns[0].textContent.trim(),
        date: moment(parseTimestamp(columns[1].textContent.trim())).toISOString(),
        numberOfQuestions: columns[2].textContent.trim(),
        numberOfCorrect: columns[3].textContent.trim(),
        mark: columns[4].textContent.trim(),
        videoWatchedPercentage: columns[5].textContent.trim(),
        certificate: columns[6].textContent.trim(),
        totalTimeTakenMinSec: columns[7]?.textContent?.trim() ?? "00:00",
      }
    })

  }, fromDate, toDate);
}

async function collectReport(page, student) {

  const subjects = await getSelectBoxOptions(page, SUBJECT_SELECT_SELECTOR);
  const fromDate = startOfDate(moment());
  const toDate = endOfDate(moment(fromDate));

  const fromDateISOString = fromDate.toISOString();
  const toDateISOString = toDate.toISOString();

  console.log('____________________________student', student);
  console.log('____________________________fromDate ~ toDate', fromDateISOString, "~", toDateISOString);

  for (let i = 0; i<subjects.length; i++) {
    await chooseOption(page, SUBJECT_SELECT_SELECTOR, subjects[i].id);
    await goToLessonReport(page);

    const curriculums = await getSelectBoxOptions(page, COURSE_SELECT_SELECTOR);
    for (let j = 0; j<curriculums.length; j++) {
      await chooseOption(page, COURSE_SELECT_SELECTOR, curriculums[j].id);
      try {
        const reportData = await collectReportTable(page, fromDateISOString, toDateISOString);
        console.table(reportData);
      } catch (e) {
        console.log(e);
        await delay(3000 * 1000);
      }
      await delay(3000);
    }
  }
  // select subject
  // id=applicationId
  // <option value="2" selected="selected">Mathematics</option>
  // <option value="413">Literacy</option>
}

module.exports = {
  collectReport,
}
