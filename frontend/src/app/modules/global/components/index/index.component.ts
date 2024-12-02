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
    { name: 'Center 1', consumption: 150, limit: 70 },
    { name: 'Center 2', consumption: 140, limit: 120 },
    { name: 'Center 3', consumption: 130, limit: 90 },
    { name: 'Center 4', consumption: 125, limit: 110 },
    { name: 'Center 5', consumption: 120, limit: 74 }
  ];


  ngOnInit(): void {
    this.createLineChart(); // Initialize the line chart
    this.createPieChart(); // Initialize the pie chart
    this.createExcessBarChart(); // Initialize the excess consumption bar chart
  }

  /**
   * Creates a line chart that shows the number of registered centers by month for the selected year.
   */
  createLineChart(): void {
    const ctx = document.getElementById('centersChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [{
          label: 'Registered Centers',
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
          x: { title: { display: true, text: 'Months' } }, // X-axis title
          y: { beginAtZero: true, title: { display: true, text: 'Centers' } } // Y-axis title
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
        labels: ['Center 1', 'Center 2', 'Center 3', 'Center 4', 'Center 5'], // Labels for each center
        datasets: [{
          label: 'Office Distribution',
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
            label: 'Consumption (kWh)',
            data: this.workCenters.map(center => center.consumption), // Data for consumption
            backgroundColor: '#ff1900', // Bar color for consumption
            borderColor: 'rgba(231, 76, 60, 1)',
            borderWidth: 1
          },
          {
            label: 'Limit (kWh)',
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
          x: { title: { display: true, text: 'Centers' } }, // X-axis title
          y: { beginAtZero: true, title: { display: true, text: 'Consumption (kWh)' } } // Y-axis title
        }
      }
    });
  }

  /**
   * Event handler for when the selected year changes.
   * It updates the data for the chart based on the selected year.
   *
   * @param event - The event containing the selected year value.
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
      this.chart.data.datasets[0].data = this.dataByYear[this.selectedYear]; // Update data for the selected year
      this.chart.update(); // Refresh the chart
    }
  }
}
