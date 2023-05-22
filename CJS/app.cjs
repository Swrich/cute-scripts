const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const dirPath = path.resolve(__dirname, './shell');

fs.readdir(dirPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files
    .filter((file) => path.extname(file) === '.sh')
    .forEach((file) => {
      const filePath = path.join(dirPath, file);
      console.log(filePath);
      exec(`bash ${filePath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    });
});
