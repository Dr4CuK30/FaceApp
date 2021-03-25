import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import * as faceapi from 'face-api.js';
import { element } from 'protractor';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements OnInit {
  @ViewChild('streamVideo') streamVideo!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  modelsCargados: boolean = false;
  width = 1000;
  height = 800;
  stream: any;
  constructor(private renderer2: Renderer2, private element: ElementRef) {
    Promise.all([
      faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models'),
      faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models'),
    ])
      .then(() => {
        this.modelsCargados = true;
      })
      .catch(() => console.log('Huvo un error al cargar los modelos'));
  }

  ngOnInit(): void {
    this.checkMediaDevice();
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
    console.log(this.streamVideo);
    const canvas = faceapi.createCanvasFromMedia(
      this.streamVideo.nativeElement
    );
    const displaySize = { width: this.height, height: this.height };
    faceapi.matchDimensions(canvas, displaySize);
    this.renderer2.setProperty(canvas, 'id', 'new-canvas');
    this.renderer2.setStyle(canvas, 'width', '1000');
    this.renderer2.setStyle(canvas, 'height', '1000');
    this.renderer2.appendChild(this.element.nativeElement, canvas);
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(
          this.streamVideo.nativeElement,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()

        .withFaceExpressions();

      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      const resizedDetections = faceapi.resizeResults(detections, {
        width: 1000,
        height: 800,
      });
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      console.log(resizedDetections);
    }, 100);
  }
}
