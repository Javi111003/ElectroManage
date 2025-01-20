import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { GlobalModule } from '../../global.module';
import { WorkCenterService } from '../../../../services/workCenter/work-center.service';
import { UserLogged } from '../../../../models/credential.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
  constructor(
    private global: GlobalModule,
    private http: DashboardService,
    public httpCenter: WorkCenterService,
  ){ }

  years = ['2023', '2024', '2025'];
  chart: any;
  pieChart: any;
  barChart: any;
  selectedYear: number = 2023;

  userInfo: UserLogged = [][0];
  centersCreatedData: any;
  topConsumingCenters: any[] = [];
  topBiggestCenters: any[] = [];
  topWarnedCenters: any[] = [];

  ngOnInit(): void {
    this.userInfo = this.global.getUserInfo();
    this.loadAllData();
  }

  ngOnDestroy() {
    if (this.chart)
      this.chart.destroy();
    if (this.pieChart)
      this.pieChart.destroy();
    if (this.barChart)
      this.barChart.destroy();
  }

  /**
   * This method loads all the necessary data for the dashboard.
   * It calls methods to fetch data for centers created in the selected year,
   * top five consuming centers, top five biggest centers, and top five warned centers.
   * The data fetching is done after a delay of 0 milliseconds to ensure all components are loaded.
   */
  loadAllData(): void {
    setTimeout(() => {
      this.getCentersCreated(this.selectedYear);
      this.getTopFiveConsumingCenters();
      this.getTopFiveBiggestCenters();
      this.getTopFiveWarnedCenters();
    }, 0);
  }

  /**
   * Fetches the data for centers created in the specified year.
   * @param year The year for which to fetch the data.
   */
  getCentersCreated(year: number): void {
    this.http.getCentersCreated(year).subscribe(centers => {
      this.centersCreatedData = centers.createdComapniesThisYear;
      this.createLineChart();
    });
  }

  /**
   * Fetches the data for the top five consuming centers.
   */
  getTopFiveConsumingCenters(): void {
    this.http.getTopFiveConsumingCenters().subscribe(centers => {
      this.topConsumingCenters = centers;
      this.createExcessBarChart();
    });
  }

  /**
   * Fetches the data for the top five biggest centers.
   */
  getTopFiveBiggestCenters(): void {
    this.http.getTopFiveBiggestCenters().subscribe(centers => {
      this.topBiggestCenters = centers;
      this.createPieChart();
    });
  }

  /**
   * Fetches the data for the top five warned centers.
   */
  getTopFiveWarnedCenters(): void {
    this.http.getTopFiveWarnedCenters().subscribe(centers => {
      this.topWarnedCenters = centers;
      this.createAlertTrendChart();
    });
  }

  /**
   * This function creates a line chart for the registered centers.
   * It uses the Chart.js library to generate the chart.
   * The chart is destroyed and re-created if it already exists.
   */
  createLineChart(): void {
    const canvas = document.getElementById('centersChart') as HTMLCanvasElement;
    if (!canvas)
      return;

    if (this.chart)
      this.chart.destroy();

    this.chart = new Chart(canvas, {
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
          x: { title: { display: true, text: 'Meses' } },
          y: { beginAtZero: true, title: { display: true, text: 'Centros' } }
        }
      }
    });
  }

  /**
   * This function creates a doughnut chart for the distribution of offices.
   * It uses the Chart.js library to generate the chart.
   * The chart is destroyed and re-created if it already exists.
   */
  createPieChart(): void {
    const canvas = document.getElementById('officesChart') as HTMLCanvasElement;
    if (!canvas)
      return;

    if (this.pieChart)
      this.pieChart.destroy();

    this.pieChart = new Chart(canvas, {
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
          legend: { position: 'bottom' }
        }
      }
    });
  }

  /**
   * This function creates a bar chart for the excess consumption of offices.
   * It uses the Chart.js library to generate the chart.
   * The chart is destroyed and re-created if it already exists.
   */
  createExcessBarChart(): void {
    const canvas = document.getElementById('excessChart') as HTMLCanvasElement;
    if (!canvas)
      return;

    if (this.barChart) this.barChart.destroy();

    this.barChart = new Chart(canvas, {
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

  /**
   * This function creates a line chart for the alert trend.
   * It uses the Chart.js library to generate the chart.
   * The chart is destroyed and re-created if it already exists.
   */
  createAlertTrendChart(): void {
    const canvas = document.getElementById('alertTrendChart') as HTMLCanvasElement;
    if (!canvas)
      return;

    if (this.chart)
      this.chart.destroy();

    this.chart = new Chart(canvas, {
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
          x: { title: { display: true, text: 'Meses' } },
          y: { beginAtZero: true, title: { display: true, text: 'Número de Alertas' } }
        },
        animation: {
          duration: 9000,
          easing: 'easeOutQuart',
        }
      }
    });
  }

  /**
   * Handles the change event of the year selection dropdown.
   * Updates the selected year and fetches the centers created in that year.
   * @param event The change event object.
   */
  onYearChange(event: any): void {
    this.selectedYear = +event.target.value;
    this.getCentersCreated(this.selectedYear);
  }
}
