const { waitForNavigationAndAddScriptTags } = require("../utils/dom");

async function goToReport(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".buttonbig_report")[0].click();
  });
  await waitForNavigationAndAddScriptTags(page);
}

module.exports = {
  goToReport
}
