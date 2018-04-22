// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const con = require('electron').remote.getGlobal('console')
const fs = require('fs');
const ytdl = require('ytdl-core');

const downloadButton = document.getElementById('download');
const urlInput = document.getElementById('url_input');


downloadButton.addEventListener('click', () => {


  ytdl(urlInput.value)
  .pipe(fs.createWriteStream('video.mp4'));
});
