const fs = require('fs');
const path = require('path');
const process = require('process');

const oldPath = path.join(__dirname, 'styles');
const newPath = path.join(__dirname, 'project-dist', 'bundle.css');

const streamWrite = fs.createWriteStream(newPath);

fs.readdir(oldPath, {withFileTypes: true}, (error, files) => {
  if (error) {
    process.stdout.write("Oops, Something went wrong: " + error);
  }

  files.forEach(item => {
    const filePath = path.join(oldPath, item.name);
    if (item.isFile() && path.extname(filePath) === '.css') {
      const streamRead = fs.createReadStream(filePath);

      streamRead.on('data', data => {
        streamWrite.write(`${data}\n`);
      });
    }
  });
});