import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { MatNativeDateModule } from '@angular/material/core';

Chart.register(...registerables);

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  constructor(private http: DashboardService){}

  years = ['2023', '2024', '2025'];
  chart: any;
  pieChart: any;
  barChart: any;
  selectedYear: number = 2023;

  // Nuevas propiedades para almacenar datos del servicio
  centersCreatedData: any[] = [];
  topConsumingCenters: any[] = [];
  topBiggestCenters: any[] = [];
  topWarnedCenters: any[] = [];

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    // Cargar todos los datos necesarios
    this.getCentersCreated(this.selectedYear);
    this.getTopFiveConsumingCenters();
    this.getTopFiveBiggestCenters();
    this.getTopFiveWarnedCenters();
  }

  getCentersCreated(year: number): void {
    this.http.getCentersCreated(year).subscribe(centers => {
      this.createLineChart();
    });
  }

  getTopFiveConsumingCenters(): void {
    this.http.getTopFiveConsumingCenters().subscribe(centers => {
      this.topConsumingCenters = centers;
      console.log(this.topConsumingCenters);
      this.createExcessBarChart();
    });
  }

  getTopFiveBiggestCenters(): void {
    this.http.getTopFiveBiggestCenters().subscribe(centers => {
      this.topBiggestCenters = centers;
      console.log(this.topBiggestCenters);
      this.createPieChart();
    });
  }

  getTopFiveWarnedCenters(): void {
    this.http.getTopFiveWarnedCenters().subscribe(centers => {
      this.topWarnedCenters = centers;
      console.log(this.topWarnedCenters);
      this.createAlertTrendChart();
    });
  }

  createLineChart(): void {
    const ctx = document.getElementById('centersChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        datasets: [{
          label: 'Centros Registrados',
          data: this.centersCreatedData,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.2)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#3498db'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Meses' } }, // X-axis title
          y: { beginAtZero: true, title: { display: true, text: 'Centros' } } // Y-axis title
        }
      }
    });
  }

  createPieChart(): void {
    const ctx = document.getElementById('officesChart') as HTMLCanvasElement;
    this.pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.topBiggestCenters.map(center => center.companyName),
        datasets: [{
          label: 'Distribución de Oficinas',
          data: this.topBiggestCenters.map(center => center.officeCount),
          backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' } // Position of the legend
        }
      }
    });
  }

  createExcessBarChart(): void {
    const ctx = document.getElementById('excessChart') as HTMLCanvasElement;
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.topConsumingCenters.map(center => center.companyId),
        datasets: [
          {
            label: 'Consumo (kWh)',
            data: this.topConsumingCenters.map(center => center.totalConsumption),
            backgroundColor: '#ff1900',
            borderColor: 'rgba(231, 76, 60, 1)',
            borderWidth: 1
          },
          {
            label: 'Límite (kWh)',
            data: this.topConsumingCenters.map(center => center.limit),
            backgroundColor: 'rgba(127, 140, 141, 0.8)',
            borderColor: 'rgba(127, 140, 141, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Centros' } }, // X-axis title
          y: { beginAtZero: true, title: { display: true, text: 'Consumo (kWh)' } } // Y-axis title
        }
      }
    });
  }

  createAlertTrendChart(): void {
    const ctx = document.getElementById('alertTrendChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        datasets: this.topWarnedCenters.map((center, index) => ({
          label: center.company.name,
          data: center.countWarning,
          borderColor: `hsl(${index * 60}, 70%, 50%)`,
          fill: false
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Meses' } }, // X-axis title
          y: { beginAtZero: true, title: { display: true, text: 'Número de Alertas' } } // Y-axis title
        },
        animation: {
          duration: 9000,
          easing: 'easeOutQuart',
        }
      }
    });
  }

  onYearChange(event: any): void {
    this.selectedYear = +event.target.value;
    this.getCentersCreated(this.selectedYear);
  }
}
