// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var nodeConsole = require('console');
var con = new nodeConsole.Console(process.stdout, process.stderr);
const fs = require('fs');
const ytdl = require('ytdl-core');

const downloadButton = document.getElementById('download');
const urlInput = document.getElementById('url_input');

const dropDown = document.getElementById('dropdown');
const mp4 = document.getElementById('mp4');
const m4a = document.getElementById('m4a');

const downloadingArea = document.getElementById('downloading');
const finished = document.getElementById('finished');
const downloadManager = {};

downloadButton.addEventListener('click', async () => {
  const url = urlInput.value;
  const id = urlInput.value + ' (.' + dropDown.innerText + ')';
  let downloading;
  if (!downloadManager[id]) {
    downloadManager[id] = true;
    const video = ytdl(url,
        {filter: (format) => format.container === dropDown.innerText});
    downloadingArea.appendChild(createFetchingDiv(id, url));
    video.on('progress', (chunkLength, downloaded, totalLength) => {
      //con.log(chunkLength, downloaded, totalLength);
      const progress = (downloaded / totalLength).toFixed(2) * 100;
      const progressBar = document.getElementById(id + '-bar');
      progressBar.innerText = progress.toFixed(0) + '%';
      progressBar.setAttribute('style', 'width:' + progress + '%');
      progressBar.setAttribute('aria-valuenow', progress + '');
      progressBar.setAttribute('class',
          'progress-bar progress-bar-striped progress-bar-animated bg-warning');
      if (downloaded == totalLength) {
        document.getElementById('progess-' + id).remove();
        downloadManager[id] = false;
        downloading.remove();
        finished.appendChild(downloading);
      }
    });
    video.on('error', (err) => {
      con.log(err);
    });
    let started = false;
    video.on('info', (metaData, format) => {
      if (!started) {
        started = true;
        document.getElementById(id).remove();
        downloading = downloadingArea.appendChild(createMetaDataDiv(id));
        const label = document.getElementById(id + '-label');
        label.innerText = label.innerText + ' - ' + metaData.title;
        video.pipe(fs.createWriteStream(metaData.title.replace(
            /[&\/\\#,+()$~%.'":*?<>{}]/g, '') + '.' + dropDown.innerText));
      }
    });
  }
});

function createFetchingDiv(id, url) {
  const row = document.createElement('div');
  row.setAttribute('id', id);
  row.setAttribute('class', 'row border');
  const col = document.createElement('div');
  col.setAttribute('class', 'col-12');
  col.innerText = 'Fetching data... for: ' + url;
  row.appendChild(col);
  return row;
}

function createMetaDataDiv(id) {

  const row = document.createElement('div');
  row.setAttribute('id', id);
  row.setAttribute('class', 'row border');

  const col = document.createElement('div');
  col.setAttribute('class', 'col');
  row.appendChild(col);

  const label = document.createElement('label');
  label.setAttribute('id', id + '-label');
  label.innerText = id;
  col.appendChild(label);

  const progress = document.createElement('div');
  progress.setAttribute('id', 'progess-' + id);
  progress.setAttribute('class', 'progress');
  col.appendChild(progress);

  const progressBar = document.createElement('div');
  progressBar.setAttribute('class', 'progress-bar bg-danger');
  progressBar.setAttribute('role', 'progressbar');
  progressBar.setAttribute('aria-valuenow', '0');
  progressBar.setAttribute('aria-valuemin', '0');
  progressBar.setAttribute('aria-valuemax', '100');
  progressBar.setAttribute('id', id + '-bar');
  progressBar.value = '0%';

  progress.appendChild(progressBar);

  return row;
}

m4a.addEventListener('click', async () => {
  dropDown.innerText = m4a.innerText;
});

mp4.addEventListener('click', async () => {
  dropDown.innerText = mp4.innerText;
});