const { waitForNavigationAndAddScriptTags } = require("../utils/dom");
const { BASE_URL } = require("../utils/constants");

async function login(page) {
  await page.goto(BASE_URL, {
    waitUntil: 'networkidle2',
  });
  await page.evaluate((id, password) => {
    document.querySelector("[name='h_username']").value = id;
    document.querySelector("[name='j_password']").value = password;
  }, global.LOGIN_ID, global.LOGIN_PASSWORD);

  await page.click("[type='button'][value='Login']");
  await waitForNavigationAndAddScriptTags(page);
}

module.exports = {
  login
}
