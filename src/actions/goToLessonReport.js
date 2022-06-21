const { waitForNavigationAndAddScriptTags } = require("../utils/dom");

async function goToLessonReport(page) {
  await page.evaluate(() => {
    document.querySelector("#tabPageheader_MY_TABCONTROL_PROGRESS_TAB > a").click();
  });
  await waitForNavigationAndAddScriptTags(page);
}

module.exports = {
  goToLessonReport,
}
