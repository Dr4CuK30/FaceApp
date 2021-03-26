import { FacedataService } from '../../services/facedata.service';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements OnInit {
  @ViewChild('streamVideo') streamVideo!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  modelsCargados: boolean = false;
  stream: any;
  faceapi: any;
  constructor(
    private faceapiService: FacedataService,
    private renderer2: Renderer2,
    private element: ElementRef
  ) {
    faceapiService.cargarModelos();
  }

  ngOnInit(): void {
    this.checkMediaDevice();
    this.faceapi = this.faceapiService.faceapi;
  }

  async checkMediaDevice() {
    if (navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      stream ? (this.stream = stream) : console.log('Compre camara probre');
      return;
    }
  }

  detect() {
    const canvas = this.faceapi.createCanvasFromMedia(
      this.streamVideo.nativeElement
    );
    const displaySize = { width: 960, height: 720 };
    this.faceapi.matchDimensions(canvas, displaySize);
    this.renderer2.setProperty(canvas, 'id', 'new-canvas');
    this.renderer2.setStyle(canvas, 'width', `${canvas.width}`);
    this.renderer2.setStyle(canvas, 'height', `${canvas.height}`);
    this.renderer2.appendChild(this.element.nativeElement, canvas);
    setInterval(async () => {
      const detections = await this.faceapiService.getDetections(
        this.streamVideo.nativeElement
      );

      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      const resizedDetections = this.faceapi.resizeResults(
        detections,
        displaySize
      );
      this.faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }, 100);
  }
}
