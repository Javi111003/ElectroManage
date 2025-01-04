import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent implements OnInit {
  progressValue: number = 0;
  intervalId: any;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit() {
    this.startProgress();
  }

  startProgress() {
    const duration = 3000;
    const interval = duration / 100;

    this.intervalId = setInterval(() => {
      this.progressValue += 1;
      if (this.progressValue >= 100) {
        clearInterval(this.intervalId);
      }
    }, interval);
  }
}
