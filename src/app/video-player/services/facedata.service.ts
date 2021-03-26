import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root',
})
export class FacedataService {
  private _detections: any;
  private _faceapi = faceapi;
  cargarModelos() {
    Promise.all([
      faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models'),
      faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models'),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri('../../assets/models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('../../assets/models'),
    ])
      .then(() => {
        return true;
      })
      .catch(() => console.log('Huvo un error al cargar los modelos'));
  }

  getDetections(video: HTMLVideoElement) {
    const detections = faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    this._detections = detections;
    return detections;
  }

  get faceapi() {
    return this._faceapi;
  }

  get detections() {
    return this._detections;
  }
}
