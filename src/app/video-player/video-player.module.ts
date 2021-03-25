import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video/video/video.component';

@NgModule({
  declarations: [VideoComponent],
  imports: [CommonModule],
  exports: [VideoComponent],
})
export class VideoPlayerModule {}
