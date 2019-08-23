import { Component, OnInit, ViewChild } from '@angular/core';
import * as ytdl from 'ytdl-core';
import * as fs from 'fs';
import * as path from 'path';
import { remote } from 'electron';

interface Video {
  url: string;
  id: string;
  title: string;
  progress: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('urlInput', {static: true}) urlInput;
  @ViewChild('dir', {static: true}) dir;

  downloading = new Map<string, Video>();
  done = [];
  selected = 'mp4';

  constructor() {

  }

  ngOnInit() {
    this.dir.nativeElement.value = remote.app.getAppPath();
  }

  downloadHandling = () => {
    const url = this.urlInput.nativeElement.value;
    if (ytdl.validateURL(url)) {
      const video = this.createVideo(url);
      if (!this.downloading.has(video.id)) {
        let stream;
        let writeStream;
        this.downloading.set(video.id, video);
        const state = ytdl(url, {filter: (format) => format.container === this.selected});
        state.on('progress', async (chunkLength, downloaded, totalLength) => {
          video.progress = (downloaded / totalLength) * 100;
          if (downloaded === totalLength) {
            this.downloading.delete(video.id);
            this.done.push(video)
          }
        });
        state.on('error', (err) => {
          console.error(err)
          this.downloading.delete(video.id);
        });
        state.on('info', async (metaData, format) => {
          const fileName = `${metaData.title.replace(/[^a-z0-9]/gi, '_')}.${this.selected}`;
          video.title = fileName;
          writeStream = fs.createWriteStream(path.resolve(this.dir.nativeElement.value, fileName));
          stream = state.pipe(writeStream);
        });
      }
    }
  }

  createVideo(url: string): Video {
    return {url, id: ytdl.getVideoID(url) as string + this.selected, title: '', progress: 0};
  }
}
