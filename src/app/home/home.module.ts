import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from "../material.module";
import {YoutubeDownloadModule} from "../youtube-download/youtube-download.module";

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule, MaterialModule, YoutubeDownloadModule]
})
export class HomeModule {}
