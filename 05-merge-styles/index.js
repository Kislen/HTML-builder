const fs = require('fs');
const path = require('path');

async function assembleStyle() {
  const stylesPath = path.join(__dirname, 'styles');
  const styleFiles = await fs.promises.readdir(stylesPath);

  const cssFiles = styleFiles.filter(name => path.extname(name) === '.css');
  const filesContent = await Promise.all(
    cssFiles.map(filename => fs.promises.readFile(path.join(stylesPath, filename), 'utf8'))
  );
  const cssTotal = filesContent.join('\n');

  const distDir = path.join(__dirname, 'project-dist');

  await fs.promises.writeFile(path.join(distDir, 'bundle.css'), cssTotal);
}

assembleStyle();