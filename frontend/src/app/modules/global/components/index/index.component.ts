import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  years = ['2023', '2024', '2025']; // Available years for the charts
  chart: any; // Line chart
  pieChart: any; // Pie chart (doughnut)
  barChart: any; // Bar chart for consumption excess
  selectedYear: number = 2023; // Default selected year
  dataByYear: any = {
    2023: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
    2024: [6, 12, 18, 22, 28, 33, 38, 44, 50, 56, 62, 70],
    2025: [7, 14, 21, 26, 32, 38, 44, 50, 56, 62, 68, 75]
  };

  // Data for work centers with consumption excess
  workCenters = [
    { name: 'Centro 1', consumption: 150, limit: 70 },
    { name: 'Centro 2', consumption: 140, limit: 120 },
    { name: 'Centro 3', consumption: 130, limit: 90 },
    { name: 'Centro 4', consumption: 125, limit: 110 },
    { name: 'Centro 5', consumption: 120, limit: 74 }
  ];

  // Data for alerts
  alertData = [
    {
      center: "Centro 1",
      data: [12, 19, 3, 5, 2, 3, 6, 10, 8, 7, 15, 14],
      actual_data:23

    },
    {
      center: "Centro 2",
      data: [2, 3, 20, 5, 1, 4, 9, 6, 5, 12, 13, 8],
      actual_data:32
    },
    {
      center: "Centro 3",
      data: [3, 10, 13, 15, 22, 30, 25, 28, 21, 18, 19, 17],
      actual_data:4
    },
    {
      center: "Centro 4",
      data: [5, 9, 10, 6, 7, 8, 11, 14, 10, 12, 9, 6],
      actual_data:12
    },
    {
      center: "Centro 5",
      data: [8, 13, 19, 23, 16, 10, 15, 17, 14, 13, 12, 9],
      actual_data:2
    }
  ];

  ngOnInit(): void {
    this.createLineChart(); // Initialize the line chart
    this.createPieChart(); // Initialize the pie chart
    this.createExcessBarChart(); // Initialize the excess consumption bar chart
    this.createAlertTrendChart(); // Initialize the alert trend chart
  }

  /**
   * Creates a line chart that shows the number of registered centers
   * by month for the selected year.
   */
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
          data: this.dataByYear[this.selectedYear], // Data for the selected year
          borderColor: '#3498db', // Line color
          backgroundColor: 'rgba(52, 152, 219, 0.2)', // Area color
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#3498db' // Point color
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

  /**
   * Creates a pie chart (doughnut) that shows the distribution of centers.
   */
  createPieChart(): void {
    const ctx = document.getElementById('officesChart') as HTMLCanvasElement;
    this.pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Centro 1', 'Centro 2', 'Centro 3', 'Centro 4', 'Centro 5'], // Labels for each center
        datasets: [{
          label: 'Distribución de Oficinas',
          data: [30, 25, 15, 20, 10], // Data for each center
          backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'], // Colors for each section
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

  /**
   * Creates a bar chart showing the consumption and limit for different work centers.
   */
  createExcessBarChart(): void {
    const ctx = document.getElementById('excessChart') as HTMLCanvasElement;
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.workCenters.map(center => center.name), // Labels from work center names
        datasets: [
          {
            label: 'Consumo (kWh)',
            data: this.workCenters.map(center => center.consumption), // Data for consumption
            backgroundColor: '#ff1900', // Bar color for consumption
            borderColor: 'rgba(231, 76, 60, 1)',
            borderWidth: 1
          },
          {
            label: 'Límite (kWh)',
            data: this.workCenters.map(center => center.limit), // Data for limit
            backgroundColor: 'rgba(127, 140, 141, 0.8)', // Bar color for limit
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
   * Creates a line chart showing the alert trends for the top 5 centers.
   */
  createAlertTrendChart(): void {
    const ctx = document.getElementById('alertTrendChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        datasets: this.alertData.map((center, index) => ({
          label: center.center,
          data: center.data,
          borderColor: `hsl(${index * 60}, 70%, 50%)`, // Different color for each line
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

  /**
   * Event handler for when the selected year changes.
   * It updates the data for the chart based on the selected year.
   * @param event The event containing the selected year value.
   */
  onYearChange(event: any): void {
    this.selectedYear = +event.target.value; // Update the selected year
    this.updateChartData(); // Update chart data based on the new year
  }

  /**
   * Updates the data of the line chart based on the selected year.
   * It refreshes the chart to reflect the new data.
   */
  updateChartData(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.dataByYear[this.selectedYear]; // Update data for the selected year this.chart.update(); // Refresh the chart }
      }
    }
  }
