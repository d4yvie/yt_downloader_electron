import { Component, OnInit, ViewChild } from '@angular/core';

import * as path from 'path';
import { remote } from 'electron';

import * as lineReader from 'line-reader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElectronComponent } from '../electron-component';
import {Video, YoutubeDownloadService} from "../youtube-download/youtube-download.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends ElectronComponent implements OnInit {

  @ViewChild('urlInput', {static: true}) urlInput;
  @ViewChild('dir', {static: true}) dir;
  @ViewChild('file', {static: true}) file;

  downloading: Observable<Map<string, Video>>;
  done: Observable<Map<string, Video>>;
  selected = 'video';

  constructor(private readonly snackBar: MatSnackBar, private readonly youtubeDownloadService: YoutubeDownloadService) {
    super();
  }

  ngOnInit() {
    this.downloading = this.youtubeDownloadService.getDownloadingObservable();
    this.done = this.youtubeDownloadService.getDoneObservable();
    this.dir.nativeElement.value = remote.app.getPath('desktop');
    this.file.nativeElement.value = remote.app.getPath('desktop') + path.sep + 'videos.txt';
  }

  downloadFromUrl = () => {
    this.youtubeDownloadService.downloadHandling(this.urlInput.nativeElement.value, this.dir.nativeElement.value, this.selected);
    this.urlInput.nativeElement.value = '';
  }

  downloadFromTextFile = () => {
    lineReader.eachLine(this.file.nativeElement.value, (line, last) => this.youtubeDownloadService.downloadHandling(line, this.dir.nativeElement.value, this.selected));
  }

  async cancelDownload(video: Video) {
    await this.youtubeDownloadService.cancelDownload(video);
    this.snackBar.open(`Canceled downloading ${video.title}`);
  }

  async deleteDone(video: Video) {
    await this.youtubeDownloadService.deleteDoneVideo(video);
    this.snackBar.open(`Deleted ${video.title}`);
  }
}
