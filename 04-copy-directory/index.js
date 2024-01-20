const fs = require('fs').promises;
const path = require('path');
const process = require('process');

const oldPathToDirectory = path.join(__dirname, 'files');
const newPathToDirectory = path.join(__dirname, 'files-copy');

async function copyDirectory() {
  try {
    await fs.mkdir(newPathToDirectory, {recursive: true});

    const arrayFilesOldDir = await fs.readdir(oldPathToDirectory, {withFileTypes: true});
    const arrayFilesNewDir = await fs.readdir(newPathToDirectory, {withFileTypes: true});

    arrayFilesNewDir.forEach(item => {
      fs.unlink(path.join(newPathToDirectory, item.name));
    });
    
    arrayFilesOldDir.forEach(item => {
      const oldPath = path.join(oldPathToDirectory, item.name);
      const newPath = path.join(newPathToDirectory, item.name);
      fs.copyFile(oldPath, newPath);
    });

  } catch (error) {
    process.stdout.write("Oops, Something went wrong: " + error);
  }
}

copyDirectory();