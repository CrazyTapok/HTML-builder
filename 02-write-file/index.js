const fs = require('fs');
const path = require('path');
const process = require('process');

const streamWrite = fs.createWriteStream(path.join(__dirname, 'text.txt'));

process.stdout.write("Hello! Write your message:\n");

process.stdin.on('data', message => {
  if (message.toString().trim().toLowerCase() === 'exit') {
   end();
  } else {
    streamWrite.write(message);
  }
});


process.on('SIGINT', () => {
  end();
});

function end() {
  process.stdout.write("Good luck friend and Goodbye!");
  streamWrite.end();
  process.exit();
}