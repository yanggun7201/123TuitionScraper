const { JS_FILE_PATHS } = require("./constants");

async function waitForNavigationAndAddScriptTags(page) {
  await page.waitForNavigation();
  // add some scripts
  for (let i = 0; i<JS_FILE_PATHS.length; i++) {
    await page.addScriptTag({ path: require.resolve(JS_FILE_PATHS[i]) });
  }
}

async function getSelectBoxOptions(page, selector) {
  return await page.evaluate((selector) => {
    return Array.from(
      document.querySelector(selector).options
    ).map(option => {
      return {
        name: option.text,
        id: option.value,
      }
    });

  }, selector);
}

async function chooseOption(page, selector, id) {
  console.log('"chooseOption"', selector, id);
  await page.select(selector, id);
  await waitForNavigationAndAddScriptTags(page);
}

module.exports = {
  waitForNavigationAndAddScriptTags,
  getSelectBoxOptions,
  chooseOption,
}
