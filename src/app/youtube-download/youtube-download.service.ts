import { Injectable } from '@angular/core';
import * as ytdl from 'ytdl-core';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import {MatSnackBar} from "@angular/material/snack-bar";
import {BehaviorSubject, Observable} from "rxjs";

const unlink = util.promisify(fs.unlink);

export interface Video {
  url: string;
  id: string;
  filePath: string;
  title: string;
  progress: number;
  ytdl?: any;
  stream?: any;
  writeStream?: any;
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeDownloadService {

  readonly downloading = new BehaviorSubject(new Map<string, Video>());
  readonly done = new BehaviorSubject(new Map<string, Video>());

  constructor(private readonly snackBar: MatSnackBar) { }

  getDownloadingObservable(): Observable<Map<string, Video>> {
    return this.downloading.asObservable();
  }

  getDoneObservable(): Observable<Map<string, Video>> {
    return this.done.asObservable();
  }

  getDownloading(): Map<string, Video> {
    return this.downloading.getValue();
  }

  getDone(): Map<string, Video> {
    return this.done.getValue();
  }

  downloadHandling = (url, directory: string, selectedFormat: string) => {
    if (ytdl.validateURL(url)) {
      const video = this.createVideo(url, selectedFormat);
      if (!this.getDownloading().has(video.id)) {
        if (this.getDone().has(video.id)) {
          this.deleteDone(video);
        }
        this.setDownloading(video);
        let downloadState;
        if (selectedFormat === 'audio') {
          downloadState = ytdl(url, {filter: (format) =>  {
              console.log(format)
              return format.mimeType.includes(selectedFormat);
            }, quality: 'highestaudio'});
        } else {
          downloadState = ytdl(url, {filter: (format) =>  {
              console.log(format)
              return format.mimeType.includes(selectedFormat);
            }});
        }
        console.log(downloadState)
        video.ytdl = downloadState;
        downloadState.on('progress', async (chunkLength, downloaded, totalLength) => {
          video.progress = Math.floor(downloaded / totalLength * 100);
          if (downloaded === totalLength) {
            this.deleteDownloading(video);
            this.setDone(video);
            this.snackBar.open(`Finished downloading ${video.title}`);
          }
        });
        downloadState.on('error', (err) => {
          console.error(err);
          this.deleteDownloading(video);
        });
        downloadState.on('info', async (metaData, format) => {
          const fileName = `${metaData.videoDetails.title.replace(/[^a-z0-9]/gi, '_')}_${format.quality ? format.quality: ''}_${format.audioBitrate}.${format.container}`;
          video.title = fileName;
          this.snackBar.open(`Started downloading ${video.title}`);
          video.filePath = path.resolve(directory, fileName);
          video.writeStream = fs.createWriteStream(video.filePath);
          video.stream = downloadState.pipe(video.writeStream);
        });
      }
    }
  }

  emitDownloading() { this.downloading.next(this.getDownloading()); }

  emitDone() { this.done.next(this.getDone()); }

  setDownloading(video: Video) {
    this.getDownloading().set(video.id, video);
    this.emitDownloading();
  }

  setDone(video: Video) {
    this.getDone().set(video.id, video);
    this.emitDone();
  }

  deleteDownloading(video: Video) {
    this.getDownloading().delete(video.id);
    this.emitDownloading();
  }

  deleteDone(video: Video) {
    this.getDone().delete(video.id)
    this.emitDone();
  }

  createVideo(url: string, selectedFormat: string): Video {
    return {url, id: ytdl.getVideoID(url) as string + selectedFormat, title: '', progress: 0, filePath: ''};
  }

  async cancelDownload(video: Video) {
    video.writeStream.destroy();
    video.stream.close();
    this.deleteDownloading(video);
    return this.deleteVideo(video);
  }

  async deleteDoneVideo(video: Video) {
    this.deleteDone(video);
    return this.deleteVideo(video);
  }

  async deleteVideo(video: Video) {
    return unlink(video.filePath);
  }
}
