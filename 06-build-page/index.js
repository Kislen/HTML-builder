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
  
  
  const files = await fs.promises.readdir(componentsDir);
  for (let file of files) {
    // Заменяем шаблонные теги в файле-шаблоне на содержимое компонента
    const filePath = path.join(__dirname, 'components', file);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    template = template.replace(`{{${path.parse(file).name}}}`, content);
  }

  // Сохраняем результат в файл project-dist/index.html
  await fs.promises.writeFile(indexPath, template, 'utf-8');
 

  // Получаем список файлов со стилями
  const styles = await fs.promises.readdir(path.join(__dirname, 'styles'));
  let styleContent = '';
  for (const style of styles) {
    // Читаем содержимое файла со стилем
    const stylePath = path.join(__dirname, 'styles', style);
    const content = await fs.promises.readFile(stylePath, 'utf-8');
    styleContent += content + '\n';
  }
  
  // Сохраняем все стили в один файл project-dist/style.css
  await fs.promises.writeFile(stylePath, styleContent, 'utf-8');
  copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
 
}

build();