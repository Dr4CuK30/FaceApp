import { FacedataService } from '../../services/facedata.service';
import {
  Component,
  ElementRef,
  HostListener,
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
  @ViewChild('caja') caja!: ElementRef;
  modelsCargados: boolean = false;
  stream: any;
  faceapi: any;
  canvas: any;
  displaySize: any;
  cajaStyle = {
    position: 'relative',
    'height.px': '500',
  };
  constructor(
    private faceapiService: FacedataService,
    private renderer2: Renderer2
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
    this.canvas = this.faceapi.createCanvasFromMedia(
      this.streamVideo.nativeElement
    );
    this.displaySize = {
      width: this.streamVideo.nativeElement.offsetWidth,
      height: this.streamVideo.nativeElement.offsetHeight,
    };
    this.faceapi.matchDimensions(this.canvas, this.displaySize);
    this.renderer2.setProperty(this.canvas, 'id', 'new-canvas');
    this.renderer2.setStyle(this.canvas, 'width', `${this.canvas.width}`);
    this.renderer2.setStyle(this.canvas, 'height', `${this.canvas.height}`);
    this.renderer2.appendChild(this.caja.nativeElement, this.canvas);
    setInterval(async () => {
      const detections = await this.faceapiService.getDetections(
        this.streamVideo.nativeElement
      );
      this.canvas
        .getContext('2d')
        ?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const resizedDetections = this.faceapi.resizeResults(
        detections,
        this.displaySize
      );
      this.faceapi.draw.drawFaceLandmarks(this.canvas, resizedDetections);
    }, 250);
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.canvas.width = this.streamVideo.nativeElement.offsetWidth;
    this.canvas.height = this.streamVideo.nativeElement.offsetHeight;
    this.displaySize = { width: this.canvas.width, height: this.canvas.height };
    this.cajaStyle['height.px'] =
      this.streamVideo.nativeElement.offsetHeight + 50;
  }
}
