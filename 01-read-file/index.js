const fs = require('fs');
const path = require('path');

const streamReader = fs.createReadStream(path.join(__dirname, 'text.txt'));

streamReader.on('data', (chunk) => {
  console.log(chunk.toString());
});

streamReader.on('error', e => {
  console.log(e);
})