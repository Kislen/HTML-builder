const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, aim) {
  src = path.join(__dirname, src);
  aim = path.join(__dirname, aim);
  try {
    await fs.access(aim);
  } catch (error) {
    await fs.mkdir(aim);
  }
  const files = await fs.readdir(src);
  for (let file of files) {
    const currentSrc = path.join(src, file);
    const currentAim = path.join(aim, file);
    const fileStat = await fs.stat(currentSrc);
    if (fileStat.isDirectory()) {
      await copyDir(currentSrc, currentAim);
    } else {
      await fs.copyFile(currentSrc, currentAim);
    }
  }
}

copyDir('files', 'files-copy')
  .then(() => console.log('Directory copied successfully'))
  .catch((err) => console.log(err));






