import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  years=['2023','2024','2025']
  chart: any; // Para almacenar la referencia de la gráfica
  selectedYear: number = 2023; // Año seleccionado por defecto
  dataByYear: any = {
    2023: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
    2024: [6, 12, 18, 22, 28, 33, 38, 44, 50, 56, 62, 70],
    2025: [7, 14, 21, 26, 32, 38, 44, 50, 56, 62, 68, 75]
  };

  constructor() {}

  ngOnInit(): void {
    // Inicializamos la gráfica al cargar el componente con los datos predeterminados para 2023
    this.createLineChart();
    this.createPieChart(); // Agregamos la creación del gráfico de pastel
  }

  createLineChart(): void {
    const ctx = document.getElementById('centersChart') as HTMLCanvasElement;
    
    // Creamos la gráfica
    this.chart = new Chart(ctx, {
      type: 'line', // Tipo de gráfica
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], // Meses
        datasets: [{
          label: 'Centros Registrados',
          data: this.dataByYear[this.selectedYear], // Datos del año seleccionado
          borderColor: '#3498db', // Color de la línea
          backgroundColor: 'rgba(52, 152, 219, 0.2)', // Color de relleno bajo la línea
          borderWidth: 2, // Grosor de la línea
          pointRadius: 4, // Tamaño de los puntos
          pointBackgroundColor: '#3498db' // Color de los puntos
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Meses'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Centros'
            }
          }
        }
      }
    });
  }
  // Gráfico de pastel
  createPieChart(): void {
    const ctx = document.getElementById('officesChart') as HTMLCanvasElement;
    
    new Chart(ctx, {
      type: 'pie', // Tipo de gráfica
      data: {
        labels: ['Centro 1', 'Centro 2', 'Centro 3', 'Centro 4', 'Centro 5'], // Nombres de centros
        datasets: [{
          label: 'Distribución de Oficinas',
          data: [30, 25, 15, 20, 10], // Número de oficinas por cada centro
          backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'], // Colores de cada sección
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': ' + tooltipItem.raw + ' Oficinas';
              }
            }
          }
        }
      }
    });
  }
  // Función que se llama cuando el usuario selecciona un año
  onYearChange(event: any): void {
    this.selectedYear = +event.target.value; // Obtener el valor del año seleccionado
    this.updateChartData(); // Actualizar la gráfica con los datos del año seleccionado
  }

  // Función para actualizar los datos de la gráfica
  updateChartData(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.dataByYear[this.selectedYear];
      this.chart.update(); // Actualizar la gráfica
    }
  }
}
