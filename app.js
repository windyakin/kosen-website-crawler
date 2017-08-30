const Promise = require('bluebird');
const File = require('async-file');
const Log4js = require('log4js');
const Puppeteer = require('puppeteer');
const moment = require('moment');

const logger = Log4js.getLogger();
logger.level = 'debug';

(async () => {
  logger.debug('Loading websites.json...');
  const websites = JSON.parse(await File.readFile('websites.json'));
  logger.debug(`Loaded ${websites.length} web sites setting.`);

  const folderName = `screenshots/${moment().format('YYYYMMDDHHmmss')}`;
  await File.mkdir(folderName);

  const browser = await Puppeteer.launch({ args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ] });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });

  await new Promise(resolve => resolve(
    websites,
    Array.from(Array(websites.length).keys()),
  )).each(async (website, index) => {
    const fileIndex = (index + 1).toString().padStart(2, '0');
    const filePath = `${folderName}/${fileIndex}_${website.name}.png`;
    logger.info(`Get ${website.name} (${website.url}) ...`);
    try {
      await page.goto(website.url);
      await page.screenshot({ path: filePath, fullPage: true });
    } catch (e) {
      logger.error(e);
      return;
    }
    logger.info(`Saved! ${filePath}`);
  });

  browser.close();
})();
