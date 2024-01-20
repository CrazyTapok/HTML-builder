const fs = require('fs');
const path = require('path');
const process = require('process');

const pathToCurrentFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToCurrentFolder, {withFileTypes: true}, (error, files) => {
  if (error) {
    process.stdout.write("Oops, Something went wrong: " + error);
  }

  files.forEach(item => {
    if (item.isFile()) {
      const filePath = path.join(pathToCurrentFolder, item.name);
      const fileExtension = path.extname(filePath).substring(1);
      const fileName = path.parse(filePath).name;

      fs.stat(filePath, (error, stats) => {
        if (error) {
          process.stdout.write("Oops, Something went wrong: " + error);
        }

        process.stdout.write(`${fileName} - ${fileExtension} - ${stats.size / 1000}kb\n`);
      });
    }
  });
});