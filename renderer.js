// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var nodeConsole = require('console');
var con = new nodeConsole.Console(process.stdout, process.stderr);
const fs = require('fs');
const ytdl = require('ytdl-core');

const downloadButton = document.getElementById('download');
const urlInput = document.getElementById('url_input');

const manager = {};

downloadButton.addEventListener('click', () => {
  if (!manager[urlInput.value]) {
    manager[urlInput.value] = true;
    const video = ytdl(urlInput.value);
    video.on('progress', (chunkLength, downloaded, totalLength) => {
      //con.log(chunkLength, downloaded, totalLength);
      if (downloaded == totalLength) {
        con.log('fin');
        manager[urlInput.value] = false;
      }
    });
    video.on('info', (chunkLength, downloaded) => {
      con.log(chunkLength, downloaded)
    });
    video.pipe(fs.createWriteStream('video.mp4'));
  }
});
