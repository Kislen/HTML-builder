const fs = require('fs');
const path = require('path');

async function copyDir(src, aim) {

  await fs.promises.mkdir(aim, {recursive:true});
  const files = await fs.promises.readdir(src);
 
  for (let file of files) {
    const currentSrc = path.join(src, file);
    const currentAim = path.join(aim, file);
    const fileStat = await fs.promises.stat(currentSrc);
    if (fileStat.isDirectory()) {
      await copyDir(currentSrc, currentAim);
    } else {
      await fs.promises.copyFile(currentSrc, currentAim);
    }
  }
}

async function build() {
  
  await fs.promises.mkdir(path.join(__dirname,'project-dist'), {recursive:true});
  

  const templatePath = path.join(__dirname, 'template.html');
  const indexPath = path.join(__dirname, 'project-dist', 'index.html');
  const stylePath = path.join(__dirname, 'project-dist', 'style.css' );
  const componentsDir = path.join(__dirname, 'components');


  let template = await fs.promises.readFile(templatePath, 'utf-8');
  
  
  let files = await fs.promises.readdir(componentsDir);
  files = files.filter(name => path.extname(name) === '.html');

  for (let file of files) {
    const filePath = path.join(__dirname, 'components', file);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    template = template.replace(`{{${path.parse(file).name}}}`, ('\n' + content));
  }

  
  await fs.promises.writeFile(indexPath, template, 'utf-8');
 

  
  const cssFiles = await fs.promises.readdir(path.join(__dirname, 'styles'));
  const styles = cssFiles.filter(name => path.extname(name) === '.css');
  let styleContent = '';
  for (const style of styles) {
    
    const stylePath = path.join(__dirname, 'styles', style);
    const content = await fs.promises.readFile(stylePath, 'utf-8');
    styleContent += content + '\n';
  }
  
  
  await fs.promises.writeFile(stylePath, styleContent, 'utf-8');
  copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
 
}

build();