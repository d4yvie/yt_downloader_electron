import { Component, OnInit, ViewChild } from '@angular/core';
import * as ytdl from 'ytdl-core';
import * as fs from 'fs';
import * as path from 'path';
import { remote } from 'electron';
import * as util from "util";

const unlink = util.promisify(fs.unlink);

interface Video {
  url: string;
  id: string;
  filePath: string;
  title: string;
  progress: number;
  ytdl?: any;
  stream?: any;
  writeStream?: any;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('urlInput', {static: true}) urlInput;
  @ViewChild('dir', {static: true}) dir;

  readonly downloading = new Map<string, Video>();
  readonly done = new Map<string, Video>();
  selected = 'mp4';

  constructor() {
    setInterval(() => {}, 500); // allow correct rerendering
  }

  ngOnInit() {
    this.dir.nativeElement.value = remote.app.getPath('desktop');
  }

  downloadHandling = () => {
    const url = this.urlInput.nativeElement.value;
    if (ytdl.validateURL(url)) {
      const video = this.createVideo(url);
      if (!this.downloading.has(video.id)) {
        this.downloading.set(video.id, video);
        const downloadState = ytdl(url, {filter: (format) => format.container === this.selected});
        video.ytdl = downloadState;
        downloadState.on('progress', async (chunkLength, downloaded, totalLength) => {
          video.progress = Math.floor(downloaded / totalLength * 100);
          if (downloaded === totalLength) {
            this.downloading.delete(video.id);
            this.done.set(video.id, video);
          }
        });
        downloadState.on('error', (err) => {
          console.error(err);
          this.downloading.delete(video.id);
        });
        downloadState.on('info', async (metaData, format) => {
          const fileName = `${metaData.title.replace(/[^a-z0-9]/gi, '_')}.${this.selected}`;
          video.title = fileName;
          video.filePath = path.resolve(this.dir.nativeElement.value, fileName);
          video.writeStream = fs.createWriteStream(video.filePath);
          video.stream = downloadState.pipe(video.writeStream);
        });
      }
    }
  }

  createVideo(url: string): Video {
    return {url, id: ytdl.getVideoID(url) as string + this.selected, title: '', progress: 0, filePath: ''};
  }

  async cancelDownload(video: Video) {
    video.writeStream.destroy();
    video.stream.close();
    this.downloading.delete(video.id);
    await this.deleteVideo(video);
  }

  async deleteDone(video: Video) {
    this.done.delete(video.id);
    this.deleteVideo(video);
  }

  async deleteVideo(video: Video) {
    return unlink(video.filePath);
  }
}
