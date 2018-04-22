const fs = require('fs');
const ytdl = require('ytdl-core');

function download() {
  ytdl('http://www.youtube.com/watch?v=A02s8omM_hI')
  .pipe(fs.createWriteStream('video.mp4'));
}

download();