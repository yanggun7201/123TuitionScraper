const puppeteer = require("puppeteer");

async function launchBrowser() {
  return await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    // userDataDir: path.join(process.cwd(), "ChromeSession"),
    // slowMo: 250, // slow down by 250ms
    args: [
      `--window-size=1600,2000`,
      // "--no-sandbox",
      // "--disable-web-security",
      // `--user-data-dir=data`,
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36'
    ],
    defaultViewport: {
      width: 1600,
      height: 2000
    }
  });
}

module.exports = {
  launchBrowser
}
