import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Chart, ChartTypeRegistry, ChartConfiguration, ChartType, registerables } from 'chart.js';
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
export class IndexComponent implements OnInit, OnDestroy {
  years = ['2023', '2024', '2025'];
  lineChart: Chart<keyof ChartTypeRegistry> | null = null;
  pieChart: Chart<'doughnut'> | null = null;
  barChart: Chart<'bar'> | null = null;
  alertChart: Chart<'line'> | null = null;
  selectedYear: number = 2025;
  actualMonth: number = 0;
  totalCentersPerYear: number = 0;
  createdCentersThisMonth: number = 0;
  deletedCentersThisMonth: number = 0;
  userInfo: UserLogged = [][0];
  centersCreatedData: CompanybyMonthData[]=[];
  topConsumingCenters: any[] = [];
  topBiggestCenters: any[] = [];
  topWarnedCenters: MostWarnedCenter[] = [];
  innerWidth: number;

  constructor(
    private global: GlobalModule,
    private http: DashboardService,
    public httpCenter: WorkCenterService,
  ) {
    this.innerWidth = window.innerWidth;
  }

  /**
   * Initializes the component by getting user information and loading data.
   * This method is called automatically when the component is initialized.
   */
  ngOnInit(): void {
    this.userInfo = this.global.getUserInfo();
    const today = new Date();
    this.actualMonth = today.getMonth();
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
        this.topConsumingCenters = [{
          companyName: centerDetails.name,
          totalConsumption: data.totalConsumption,
          consumptionLimit: centerDetails.consumptionLimit
        }];
        this.createExcessBarChart();
      });

      this.httpCenter.getAlertsById(companyId).subscribe(warnings => {
        this.topWarnedCenters = [{
          company: {
            id: centerDetails.id,
            name: centerDetails.name
          },
          countWarning: warnings.reduce((sum: number, month) => sum + month.countWarnings, 0),
          countWarningByMonth: warnings
        }];
        this.createAlertTrendChart();
      });
    });
  }

  /**
   * Fetches the data for centers created in the specified year.
   * @param year The year for which to fetch the data.
   */
  getCentersCreated(year: number): void {
    this.http.getCentersCreated(year).subscribe(centers => {
      this.centersCreatedData = centers.companiesByMonth;
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
    // Destruir el gráfico existente si existe
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    const createdData = this.centersCreatedData.map(data => data.countCreatedCompanies);
    const totalCreatedCenters = createdData.reduce((acc, item) => acc += item);
    const deletedData = this.centersCreatedData.map(data => data.countDeletedCompanies);
    const totalDeletedCenters = deletedData.reduce((acc, item) => acc += item);
    this.createdCentersThisMonth = createdData[this.actualMonth];
    this.deletedCentersThisMonth = deletedData[this.actualMonth];
    this.totalCentersPerYear = totalCreatedCenters - totalDeletedCenters;
    this.lineChart = new Chart(canvas, {
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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: window.innerWidth <= 768 ? 'bottom' : 'top',
            labels: {
              boxWidth: window.innerWidth <= 768 ? 10 : 20,
              font: {
                size: window.innerWidth <= 768 ? 10 : 12
              }
            }
          }
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
    // Destruir el gráfico existente si existe
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    const colors = this.topBiggestCenters.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
    
    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: this.topBiggestCenters.map(center => center.companyName),
        datasets: [{
          label: 'Distribución de Oficinas',
          data: this.topBiggestCenters.map(center => center.officeCount),
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: window.innerWidth <= 768 ? 'bottom' : 'top',
            labels: {
              boxWidth: window.innerWidth <= 768 ? 10 : 20,
              font: {
                size: window.innerWidth <= 768 ? 10 : 12
              }
            }
          }
        }
      }
    };
    
    this.pieChart = new Chart(canvas, config);
  }

  /**
   * Creates a bar chart showing consumption and limits.
   * This method generates a bar chart comparing total consumption
   * against consumption limits for centers.
   */
  createExcessBarChart(): void {
    const canvas = document.getElementById('excessChart') as HTMLCanvasElement;
    // Destruir el gráfico existente si existe
    if (this.barChart) {
      this.barChart.destroy();
    }
    
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
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
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: window.innerWidth <= 768 ? 'bottom' : 'top',
            labels: {
              boxWidth: window.innerWidth <= 768 ? 10 : 20,
              font: {
                size: window.innerWidth <= 768 ? 10 : 12
              }
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'Centros' } },
          y: { beginAtZero: true, title: { display: true, text: 'Consumo (kWh)' } }
        }
      }
    };
    
    this.barChart = new Chart(canvas, config);
  }

  /**
   * Creates a line chart showing alert trends.
   * This method generates a line chart displaying the number
   * of alerts over time for centers.
   */
  createAlertTrendChart(): void {
    const canvas = document.getElementById('alertTrendChart') as HTMLCanvasElement;
    // Destruir el gráfico existente si existe
    if (this.alertChart) {
      this.alertChart.destroy();
    }
    const isAdmin = this.userInfo.roles.includes('Admin');
    console.log(this.topWarnedCenters);

    const colors = this.topWarnedCenters.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
    this.alertChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        datasets: this.topWarnedCenters.map((center, index) => ({
          label: isAdmin ? center.company.name : this.global.getUserInfo().company.name,
          data: center.countWarningByMonth.map(warning => warning.countWarnings),
          borderColor: colors[index],
          fill: false
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: window.innerWidth <= 768 ? 'bottom' : 'top',
            labels: {
              boxWidth: window.innerWidth <= 768 ? 10 : 20,
              font: {
                size: window.innerWidth <= 768 ? 10 : 12
              }
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'Meses' } },
          y: { beginAtZero: true, title: { display: true, text: 'Número de Alertas' } }
        },
        animation: {
          duration: 5000,
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.destroyAllCharts();
    this.loadAllData();
  }

  destroyAllCharts(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
      this.lineChart = null;
    }
    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
    if (this.alertChart) {
      this.alertChart.destroy();
      this.alertChart = null;
    }
  }

  ngOnDestroy() {
    this.destroyAllCharts();
  }
}
