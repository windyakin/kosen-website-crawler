const File = require('async-file');
const Log4js = require('log4js');
const Promise = require('bluebird');
const del = require('del');

const logger = Log4js.getLogger();
logger.level = 'debug';

(async () => {
  const WORKSPACE = process.cwd();
  const screenshotsDir = `${WORKSPACE}/screenshots`;
  const sortedDir = `${screenshotsDir}/sorted`;

  const kosens = JSON.parse(await File.readFile(`${WORKSPACE}/websites.json`));
  const kosenWithIndex = kosens.map((kosen, index) => {
    const fileIndex = (index + 1).toString().padStart(2, '0');
    return `${fileIndex}_${kosen.name}`;
  });
  await del(sortedDir);
  await Promise.each(kosenWithIndex, async (kosen) => {
    await File.mkdirp(`${sortedDir}/${kosen}`);
    await File.mkdirp(`${sortedDir}/${kosen}/pc`);
    await File.mkdirp(`${sortedDir}/${kosen}/sp`);
  });

  const versions = (await (File.readdir(screenshotsDir))).filter(name => !name.match(/^(\.|sorted)/));
  await Promise.each(versions, async (version) => {
    const files = (await (File.readdir(`${screenshotsDir}/${version}`))).filter(name => !name.match(/^\./));
    await Promise.each(files, async (file) => {
      const d = file.split(/[_|.]/);
      const id = d[0];
      const index = parseInt(id, 10) - 1;
      // const kosenName = d[1];
      const device = d.length === 4 ? d[2] : 'pc';
      await File.createReadStream(`${screenshotsDir}/${version}/${file}`).pipe(File.createWriteStream(`${sortedDir}/${kosenWithIndex[index]}/${device}/${version}.png`));
    });
  });
})();
