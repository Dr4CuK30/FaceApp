import { Component, OnInit } from '@angular/core';
import { FacedataService } from '../../services/facedata.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit {
  actualDetections: any = [];
  angry_percent = `0%`;
  surprised_percent = `0%`;
  sad_percent = `0%`;
  happy_percent = `0%`;
  neutral_percent = `0%`;

  constructor(private facedataService: FacedataService) {
    setInterval(async () => {
      const detections = await this.facedataService.detections;
      if (detections && detections.length > 0) {
        this.actualDetections = detections;
        this.angry_percent = `${
          this.actualDetections[0].expressions.angry * 100
        }%`;
        this.sad_percent = `${this.actualDetections[0].expressions.sad * 100}%`;
        this.surprised_percent = `${
          this.actualDetections[0].expressions.surprised * 100
        }%`;
        this.happy_percent = `${
          this.actualDetections[0].expressions.happy * 100
        }%`;
        this.neutral_percent = `${
          this.actualDetections[0].expressions.neutral * 100
        }%`;
      }
    }, 100);
  }

  ngOnInit(): void {}
}
