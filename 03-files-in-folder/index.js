const fs = require('fs');
const path = require('path');

const foldPath = path.join(__dirname, 'secret-folder');

fs.readdir(foldPath, (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach((file) => {
    const filePath = path.join(foldPath, file);
    fs.stat(filePath, (err, dataElem) => {
      if (err) {
        throw err;
      }

      if (dataElem.isFile()) {
        const filename = path.parse(file).name;
        const ext = path.extname(file).substring(1);
        const size = dataElem.size / 1000; 
        console.log(`${filename} - ${ext} - ${size.toFixed(3)}kb`);
      }
    });
  });
});