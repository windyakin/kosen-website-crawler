const Promise = require('bluebird');
const File = require('async-file');
const os = require('os');
const Log4js = require('log4js');
const Puppeteer = require('puppeteer');
const dayjs = require('dayjs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs').promises

const Devices = require('./devices');

const logger = Log4js.getLogger();
logger.level = 'debug';

const errorCatcher = (err) => {
  logger.error(err);
  if (process.env.NODE_ENV === 'test') return;
};

(async () => {
  logger.debug('Loading websites.json...');
  const websites = JSON.parse(await File.readFile('websites.json'));
  logger.debug(`Loaded ${websites.length} web sites setting.`);

  const folderName = `${dayjs().format('YYYYMMDDHHmmss')}`;

  let s3client = undefined
  if (process.env.S3) {
    s3client = new S3Client({ region: process.env.AWS_S3_BUCKET_REGION });
  } else {
    await fs.mkdir(`screenshots/${folderName}`);
  }

  const options = {
    args: (os.platform() === 'linux' ? ['--no-sandbox', '--disable-setuid-sandbox'] : [])
  };
  if (process.env.CHROME_EXECUTE_PATH) {
    options.executablePath = process.env.CHROME_EXECUTE_PATH;
  }
  const browser = await Puppeteer.launch(options);
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
        await page.goto(website.url, { waituntil: 'networkidle0' });
        const screenshotBuffer = await page.screenshot({ type: 'png', fullPage: true });
        if (process.env.S3) {
          await s3client.send(new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filePath,
            Body: screenshotBuffer
          }));
        } else {
          await fs.writeFile(`screenshots/${filePath}`, screenshotBuffer);
        }
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
