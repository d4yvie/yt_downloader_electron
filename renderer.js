// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var nodeConsole = require('console');
var con = new nodeConsole.Console(process.stdout, process.stderr);
const fs = require('fs');
const ytdl = require('ytdl-core');

const downloadButton = document.getElementById('download');
const urlInput = document.getElementById('url_input');

const downloadingArea = document.getElementById('downloading');
const finished = document.getElementById('finished');
const manager = {};

downloadButton.addEventListener('click', () => {
  const id = urlInput.value
  if (!manager[id]) {
    manager[id] = true;
    const downloading = createDownloading(id);
    downloadingArea.appendChild(downloading);
    const video = ytdl(id);
    video.on('progress', (chunkLength, downloaded, totalLength) => {
      con.log(chunkLength, downloaded, totalLength);
      const progress = (downloaded / totalLength).toFixed(2) * 100;
      const progressBar = document.getElementById(id+'-bar');
      progressBar.innerText = progress + '%';
      progressBar.setAttribute('style', 'width:' + progress + '%');
      progressBar.setAttribute('aria-valuenow', progress + '');
      progressBar.setAttribute('class',
          'progress-bar progress-bar-striped progress-bar-animated');
      if (downloaded == totalLength) {
        progressBar.setAttribute('class', 'progress-bar progress-bar-striped');
        manager[id] = false;
        downloading.remove()
        finished.appendChild(downloading)
      }
    });
    video.on('info', (chunkLength, downloaded) => {
      //con.log(chunkLength, downloaded)
    });
    video.pipe(fs.createWriteStream('video.mp4'));
  }
});

function createDownloading(id){
  const row = document.createElement("div");
  row.setAttribute('id', id);
  row.setAttribute('class', 'row');

  const col = document.createElement("div");
  col.setAttribute('class', 'col')
  row.appendChild(col)

  const progress = document.createElement("div");
  progress.setAttribute('class', 'progress')
  col.appendChild(progress)

  const progressBar = document.createElement("div");
  progressBar.setAttribute('class', 'progress-bar')
  progressBar.setAttribute('role', 'progressbar')
  progressBar.setAttribute('aria-valuenow', '0');
  progressBar.setAttribute('aria-valuemin', '0');
  progressBar.setAttribute('aria-valuemax', '100');
  progressBar.setAttribute('id', id+'-bar')
  progressBar.value = '0%';

  progress.appendChild(progressBar)

  return row
}
