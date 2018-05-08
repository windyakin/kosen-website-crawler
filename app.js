const Promise = require('bluebird');
const File = require('async-file');
const os = require('os');
const Log4js = require('log4js');
const Puppeteer = require('puppeteer');
const moment = require('moment');

const Devices = require('./devices');

const logger = Log4js.getLogger();
logger.level = 'debug';

const errorCatcher = (err) => {
  logger.error(err);
  if (process.env.NODE_ENV === 'test') process.exit(1);
};

(async () => {
  logger.debug('Loading websites.json...');
  const websites = JSON.parse(await File.readFile('websites.json'));
  logger.debug(`Loaded ${websites.length} web sites setting.`);

  const folderName = `screenshots/${moment().format('YYYYMMDDHHmmss')}`;
  await File.mkdir(folderName);

  const puppeteerParam = (os.platform() === 'linux' ? ['--no-sandbox', '--disable-setuid-sandbox'] : []);

  const browser = await Puppeteer.launch({ args: puppeteerParam });
  const devices = Object.entries(Devices);

  await Promise.each(websites, async (website, index) => {
    await Promise.each(devices, async ([deviceName, emulateOptions]) => {
      const page = await browser.newPage();
      // NOTE: 長野高専のスマートフォンページの遷移でダイアログが出るので対応する
      page.on('dialog', async (dialog) => {
        if (dialog.message() === 'スマートフォン用サイトを表示しますか？') await dialog.accept();
      });
      await page.emulate(emulateOptions);
      const fileIndex = (index + 1).toString().padStart(2, '0');
      const filePath = `${folderName}/${fileIndex}_${website.name}_${deviceName}.png`;
      logger.info(`Get ${website.name}(${deviceName.toUpperCase()}) [${website.url}] ...`);
      try {
        await page.goto(website.url);
        await page.screenshot({ path: filePath, fullPage: true });
      } catch (e) {
        errorCatcher(e);
      } finally {
        await page.close();
      }
      logger.info(`Saved! ${filePath}`);
    }).catch(e => errorCatcher(e));
  }).catch(e => errorCatcher(e));

  browser.close();
})();
