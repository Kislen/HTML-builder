
const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;
stdout.write('please enter the text:\n');
process.on('exit', () => console.log('Input is finished. By!'));
const output = fs.createWriteStream(path.join(__dirname,  'text.txt'));
stdin.on('data', data => { 
  if (data.toString() == 'exit\r\n') {
    process.exit();
  }
  output.write(data.toString());
});
stdin.on('error', error => console.log('Error', error.message));
process.on('SIGINT', () => process.exit());



