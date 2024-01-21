const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const process = require('process');

async function buildPage() {
  const newPathToDirectory = path.join(__dirname, 'project-dist');
  const oldAssetsPath = path.join(__dirname, 'assets');
  const newAssetsPath = path.join(__dirname, 'project-dist', 'assets');

  await fsPromises.mkdir(newPathToDirectory, {recursive: true});

  await createHTMLFile();
  await copyDirectory(oldAssetsPath, newAssetsPath);
  await createNewStyleFile()
}

async function copyDirectory(oldAssets, newAssets) {
  try {
    await fsPromises.mkdir(newAssets, {recursive: true});

    const arrayFilesOldDir = await fsPromises.readdir(oldAssets, {withFileTypes: true});
    const arrayFilesNewDir = await fsPromises.readdir(newAssets, {withFileTypes: true});

    arrayFilesNewDir.forEach(item => {
      if (item.isFile()) {
        fsPromises.unlink(path.join(newAssets, item.name));
      }
    });
    
    arrayFilesOldDir.forEach(item => {
      const oldPath = path.join(oldAssets, item.name);
      const newPath = path.join(newAssets, item.name);

      if (item.isFile()) {
        fsPromises.copyFile(oldPath, newPath);
      } else {
        copyDirectory(oldPath, newPath)
      }
    });

  } catch (error) {
    process.stdout.write("Oops, Something went wrong: " + error);
  }
}

async function createHTMLFile() {
  const oldHTMLFile = path.join(__dirname, 'template.html');
  const newHTMLFile = path.join(__dirname, 'project-dist', 'index.html');
  const folderWithComponents = path.join(__dirname, 'components');
  
  const HTMLContent = await fsPromises.readFile(oldHTMLFile);
  const blocksHTML = await fsPromises.readdir(folderWithComponents, {withFileTypes: true});

  let newHTMLContent = HTMLContent.toString();

  for(const block of blocksHTML){
    const filePath = path.join(folderWithComponents, block.name);
    if (block.isFile() && path.extname(filePath) === '.html') {
      const data = await fsPromises.readFile(filePath);
      const fileName = path.parse(filePath).name;
      newHTMLContent = newHTMLContent.replace(`{{${fileName}}}`, data.toString());
    }
  }

  await fsPromises.writeFile(newHTMLFile, newHTMLContent);
}

async function createNewStyleFile() {
  const oldPath = path.join(__dirname, 'styles');
  const newPath = path.join(__dirname, 'project-dist', 'style.css');

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
}


buildPage();