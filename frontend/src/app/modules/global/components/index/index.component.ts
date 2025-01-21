import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { GlobalModule } from '../../global.module';
import { WorkCenterService } from '../../../../services/workCenter/work-center.service';
import { UserLogged } from '../../../../models/credential.interface';
import { CompanybyMonthData, MostWarnedCenter } from '../../../../models/dashboard.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit{
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
  centersCreatedData: CompanybyMonthData[]=[];
  topConsumingCenters: any[] = [];
  topBiggestCenters: any[] = [];
  topWarnedCenters: MostWarnedCenter[] = [];

  /**
   * Initializes the component by getting user information and loading data.
   * This method is called automatically when the component is initialized.
   */
  ngOnInit(): void {
    this.userInfo = this.global.getUserInfo();
    this.loadAllData();
  }
  /**
   * This method loads all the necessary data for the dashboard.
   * It calls methods to fetch data for centers created in the selected year,
   * top five consuming centers, top five biggest centers, and top five warned centers.
   * The data fetching is done after a delay of 0 milliseconds to ensure all components are loaded.
   */
  loadAllData(): void {
      if (this.userInfo.roles.includes('Admin')) {
        this.getCentersCreated(this.selectedYear);
        this.getTopFiveConsumingCenters();
        this.getTopFiveBiggestCenters();
        this.getTopFiveWarnedCenters(this.selectedYear);
      } else {
        const companyId = this.userInfo.company.id;
        this.getCompanySpecificData(companyId);
      }
  }

  /**
   * Retrieves and processes specific data for a company.
   * This method fetches consumption and alert data for a specific company
   * and creates the corresponding charts.
   * 
   * @param companyId The ID of the company to fetch data for.
   */
  getCompanySpecificData(companyId: number): void {
    this.httpCenter.getCenterById(companyId).subscribe(centerDetails => {
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;
      this.httpCenter.getRegister(companyId, startDate, endDate).subscribe(data => {
        // En lugar de usar monthlyConsumption, usaremos el formato estándar
        this.topConsumingCenters = [{
          companyName: centerDetails.name,
          totalConsumption: data.totalConsumption,
          consumptionLimit: centerDetails.consumptionLimit
        }];
        console.log(this.topConsumingCenters);
        this.createExcessBarChart();
        const monthlyConsumption = new Array(12).fill(0).map(() => ({
          totalConsumption: 0,
          count: 0
        }));
        data.registers.forEach(register => {
          const month = new Date(register.date).getMonth();
          monthlyConsumption[month].totalConsumption += register.consumption;
          monthlyConsumption[month].count++;
        });
        const monthlyAverages = monthlyConsumption.map(month => 
          month.count > 0 ? month.totalConsumption / month.count : 0
        );
        this.createMonthlyConsumptionChart(monthlyAverages);
      });
      this.httpCenter.getAlerts(companyId).subscribe(data => {
        const monthlyWarnings = new Array(12).fill(0);
        data.warnings.forEach(warning => {
          const month =warning.month;
          monthlyWarnings[month]++;
        });
        this.topWarnedCenters = [{
          company: {
            id: centerDetails.id, // Usamos el id del centerDetails 
            name: centerDetails.name // Usamos el nombre del centerDetails
          },
          countWarning: data.warnings.length,
          countWarningByMonth: monthlyWarnings.map((count, index) => ({
            month: index + 1,
            countWarning: count
          }))
        }];
        this.createAlertTrendChart();
      });
    });
  }

  /**
   * Creates a chart showing the monthly consumption data.
   * This method generates a line chart displaying average monthly consumption.
   * 
   * @param monthlyData Array of monthly consumption averages.
   */
  createMonthlyConsumptionChart(monthlyData: number[]): void {
    const canvas = document.getElementById('monthlyConsumptionChart') as HTMLCanvasElement;
    this.barChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        datasets: [{
          label: 'Consumo Mensual Promedio',
          data: monthlyData,
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          borderWidth: 2,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Meses' } },
          y: { beginAtZero: true, title: { display: true, text: 'Consumo Promedio (kWh)' } }
        }
      }
    });
  }

  /**
   * Fetches the data for centers created in the specified year.
   * @param year The year for which to fetch the data.
   */
  getCentersCreated(year: number): void {
    this.http.getCentersCreated(year).subscribe(centers => {
      this.centersCreatedData = centers.companiesByMonth;
      console.log(this.centersCreatedData);
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
  getTopFiveWarnedCenters(year:number): void {
    this.http.getTopFiveWarnedCenters(year).subscribe(centers => {
      this.topWarnedCenters = centers;
      console.log(this.topWarnedCenters);
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
    const createdData = this.centersCreatedData.map(data => data.countCreatedCompanies);
    const deletedData = this.centersCreatedData.map(data => data.countDeletedCompanies);
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        datasets: [
          {
            label: 'Centros Creados',
            data: createdData,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#3498db'
          },
          {
            label: 'Centros Eliminados',
            data: deletedData,
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.2)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#e74c3c'
          }
        ]
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
   * Creates a pie chart showing the office distribution.
   * This method generates a doughnut chart displaying the distribution
   * of offices across different centers.
   */
  createPieChart(): void {
    const canvas = document.getElementById('officesChart') as HTMLCanvasElement;
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
   * Creates a bar chart showing consumption and limits.
   * This method generates a bar chart comparing total consumption
   * against consumption limits for centers.
   */
  createExcessBarChart(): void {
    const canvas = document.getElementById('excessChart') as HTMLCanvasElement;
    const isAdmin = this.userInfo.roles.includes('Admin');
    const data = {
      labels: this.topConsumingCenters.map(center => center.companyName),
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
          data: this.topConsumingCenters.map(center => center.consumptionLimit),
          backgroundColor: 'rgba(127, 140, 141, 0.8)',
          borderColor: 'rgba(127, 140, 141, 1)',
          borderWidth: 1
        }
      ]
    };
    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false, // Añadido para mantener consistencia
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
   * Creates a line chart showing alert trends.
   * This method generates a line chart displaying the number
   * of alerts over time for centers.
   */
  createAlertTrendChart(): void {
    const canvas = document.getElementById('alertTrendChart') as HTMLCanvasElement;
    const isAdmin = this.userInfo.roles.includes('Admin');
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        datasets: this.topWarnedCenters.map(center => ({
          label: isAdmin ? center.company.name : 'Mi Empresa',
          data: center.countWarningByMonth.map(warning => warning.countWarning),
          borderColor: '#3498db',
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

  /**
   * Gets the name of the company for display purposes.
   * This method returns either the company name from the consuming centers
   * or the user's company name depending on the role.
   * 
   * @returns The name of the company to display.
   */
  getCompanyName(): string {
    if (this.userInfo.roles.includes('Admin')) {
      return this.topConsumingCenters[0]?.companyName || '';
    } else {
      return this.userInfo.company?.name || 'Mi Empresa';
    }
  }
}
