import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video/video/video.component';
import { InfoComponent } from './video/info/info.component';

@NgModule({
  declarations: [VideoComponent, InfoComponent],
  imports: [CommonModule],
  exports: [VideoComponent, InfoComponent],
})
export class VideoPlayerModule {}
