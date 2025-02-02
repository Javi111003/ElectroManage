import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Item } from '../../../../../shared/shared.module';
import { Chart } from 'chart.js/auto';
import { API_URL, EXPORT_AVG, EXPORT_PREDICTION } from '../../../../../config/api.config';

@Component({
  selector: 'app-avg-consumption',
  templateUrl: './avg-consumption.component.html',
  styleUrl: './avg-consumption.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AvgConsumptionComponent implements OnInit {
  form: FormGroup;
  selectedOptionsIds: (number | any) [] = [];
  options: Item[] = [];
  columnsToDisplay = ['Centro de Trabajo'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElements: string[] = [];
  showConsultTable: boolean = false;
  showPredictTable: boolean = false;
  export: FormControl = new FormControl();

  /**
   * Maps month numbers to their Spanish names.
   * Used for displaying month names in the prediction results.
   */
  monthMapper: Map<number, string> = new Map<number, string>([
    [1, 'Enero'], [2, 'Febrero'], [3, 'Marzo'], [4, 'Abril'],
    [5, 'Mayo'], [6, 'Junio'], [7, 'Julio'], [9, 'Agosto'],
    [9, 'Septiembre'], [10, 'Octubre'], [11, 'Noviembre'], [12, 'Diciembre']
  ]);
  dataSourcesConsult: { [key: string]: MatTableDataSource<any> } = {};
  dataSourcesPrediction: { [key: string]: MatTableDataSource<any> } = {};
  noResultsPrediction: { [key: string]: boolean } = {};

  /**
   * Collection of configuration columns for the consumption average table.
   * Defines the structure and display format of the consultation table.
   */
  displayedColumnsConsult: ConfigColumn[] = [
    { title: 'Año', field: 'year' },
    { title: 'Costo ($)', field: 'meanCost' },
    { title: 'Consumo Promedio (Kw/h)', field: 'meanConsumption' }
  ];

  /**
   * Collection of configuration columns for the prediction table.
   * Defines the structure and display format of the prediction results table.
   */
  displayedColumnsPredict: ConfigColumn[] = [
    { title: 'Mes', field: 'month' },
    { title: 'Consumo esperado', field: 'expectedConsumption' }
  ];
  predictionChart: any;

  /**
   * Component constructor.
   * Initializes the form and sets up form value change subscriptions.
   * For non-admin users, automatically sets their work center.
   *
   * @param global Service providing global functionality and data
   * @param fb FormBuilder service for creating reactive forms
   */
  constructor (
    public global: GlobalModule,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      workCenters: []
    });

    this.form.valueChanges.subscribe(() => {
      this.showConsultTable = false;
      this.showPredictTable = false;
      this.dataSourcesConsult = {};
      this.dataSourcesPrediction = {};
    });

    if (!this.global.getUserInfo().roles.includes('Admin')) {
      const id = this.global.getUserInfo().company.id;
      const name = this.global.getUserInfo().company.name;
      const workCenter: Item = {
        id: id,
        name: name
      };
      this.options = [workCenter];
      this.global.getControl(this.form, 'workCenters').setValue(this.options);
      this.findCenterIds();
    }
  }

  /**
   * Initializes the component.
   * Sets up initial state and fetches work centers if user is admin.
   * Also configures the form value change subscription for admin users.
   */
  ngOnInit() {
    this.global.Reset();
    this.global.getWorkCenters();
    if (this.global.getUserInfo().roles.includes('Admin')) {
      this.global.getControl(this.form, 'workCenters').valueChanges.subscribe(() => {
        this.findCenterIds();
        this.expandedElements = [];
      });
    }
  }

  /**
   * Exports data based on the selected options and the current view.
   *
   * This function constructs an export route based on the selected options and the current view
   * (either consultation table or prediction table). It then calls the global export function
   * with the constructed route, a filename, and the selected format.
   *
   * @remarks
   * - If `showConsultTable` is true, the function exports average consumption data.
   * - If `showPredictTable` is true, the function exports consumption prediction data.
   */
  exportFunction(): void {
    let route = `${API_URL}`;
    const userId = this.global.getUserInfo().id;
    this.findCenterIds();
    let centers = "";
    this.selectedOptionsIds.forEach(id => {
      centers += `companyIds=${id}&`
    });
    const format = this.export.value.name;

    if (this.showConsultTable) {
      route += `${EXPORT_AVG}?userId=3&${centers}format=${format}`;
      this.global.export(route, "Consumo_promedio", format);
    } else if (this.showPredictTable) {
      centers = "";
      this.selectedOptionsIds.forEach(id => {
        centers += `companiesIds=${id}&`
      });
      route += `${EXPORT_PREDICTION}?userId=${userId}&${centers}format=${format}`;
      this.global.export(route, "Predicción_de_Consumo_Trimestre", format);
    }
  }

  /**
   * Finds the IDs of the selected work centers
   */
  findCenterIds() {
    this.selectedOptionsIds = this.global.getControlValue(this.form, 'workCenters').map((item: Item) => item.id);
  }

  /**
   * Retrieves the average registers for the selected work centers.
   * This method sends a request to the WorkCenterService to fetch the
   * average registers for the IDs stored in
   * selectedOptionsIds. The response is then processed to create
   * MatTableDataSource instances for each work center,
   * which are stored in the dataSources object.
   */
  getAvgRegisters(): void {
    this.global.httpCenter.getAvgRegisters(this.selectedOptionsIds).subscribe(registers => {
      for (let index = 0; index < registers.length; index++) {
        const centerName = this.global.workCenters.find(
          item => item.id === registers[index].companyID
        )?.name;

        if (centerName) {
          this.dataSourcesConsult[centerName] = new MatTableDataSource();
          this.dataSourcesConsult[centerName].data = registers[index].yearCostDto.map(data => ({
            year: data.year,
            meanCost: data.meanCost.toFixed(2),
            meanConsumption: data.meanConsumption.toFixed(2)
          }));
        }
      }
    });
  }

  /**
   * Retrieves the consumption projections for the selected work centers.
   * This method sends a request to the WorkCenterService to fetch the
   * consumption projections for the IDs stored in
   * selectedOptionsIds. The response is then processed to create
   * MatTableDataSource instances for each work center,
   * which are stored in the dataSourcesPrediction object.
   */
  getPrediction(): void {
    if (this.predictionChart) {
      this.predictionChart.destroy();
    }

    const date = new Date();
    let labels: string[] = [
      this.monthMapper.get(date.getMonth() + 2)!,
      this.monthMapper.get(date.getMonth() + 3)!,
      this.monthMapper.get(date.getMonth() + 4)!
    ];

    this.global.httpCenter.getPrediction(this.selectedOptionsIds).subscribe(predictions => {
      console.log(predictions);
      for (let index = 0; index < predictions.length; index++) {
        const centerName = this.global.workCenters.find(
          item => item.id === predictions[index].companyId
        )?.name;

        if (centerName) {
          this.dataSourcesPrediction[centerName] = new MatTableDataSource();
          this.dataSourcesPrediction[centerName].data = predictions[index].proyections.map(data => ({
            month: this.monthMapper.get(data.month),
            expectedConsumption: data.futureConsumption
          }));
          this.noResultsPrediction[centerName] = this.dataSourcesPrediction[centerName].data.length == 0;
        }
      }
      const datasets = predictions.map(prediction => {
        const centerName = this.global.workCenters.find(
          item => item.id === prediction.companyId
        )?.name;

        return {
          label: centerName,
          data: prediction.proyections.map(p => p.futureConsumption),
          borderColor: this.getRandomColor(),
          tension: 0.1,
          borderWidth: 2
        };
      });
      this.createPredictionChart(datasets, labels);
    });
  }

  /**
   * Generates a random color in hexadecimal format.
   * Used to assign different colors to each dataset in the prediction chart.
   * @returns A string representing a color in hexadecimal format (#RRGGBB)
   */
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * Creates or updates the prediction chart using Chart.js.
   * Displays multiple datasets, one for each work center, showing their
   * predicted consumption over the next three months.
   *
   * @param datasets Array of dataset objects containing the prediction data for each work center
   * @param labels Array of strings representing the x-axis labels (months)
   */
  private createPredictionChart(datasets: any[], labels: string[]): void {
    this.predictionChart = new Chart('predictionChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Predicción de Consumo por Centro de Trabajo',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Consumo Esperado (Kw/h)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Próximos Meses'
            }
          }
        }
      }
    });
  }

  /**
   * Toggles the visibility of the table.
   * Called when the "Consultar" button is clicked.
   */
  onConsultClick(): void {
    this.showPredictTable = false;
    if (!this.showConsultTable) {
      const workCenters = this.global.getControlValue(this.form, 'workCenters');
      if (workCenters && workCenters.length > 0)
      {
        this.showConsultTable = true;
        this.getAvgRegisters();
      } else {
        this.global.openDialog('Por favor, selecciona al menos un Centro de Trabajo.');
      }
    }
  }

  /**
   * Calculate the proyection of consumption for the next 3 moths of the
   * selected work centers.
   * Called when the `Predecir` button is clicked.
   */
  onPredictionClick(): void {
    this.showConsultTable = false;
    if (!this.showPredictTable) {
      const workCenters = this.global.getControlValue(this.form, 'workCenters');
      if (workCenters && workCenters.length > 0)
      {
        this.showPredictTable = true;
        this.getPrediction();
      } else {
        this.global.openDialog('Por favor, selecciona al menos un Centro de Trabajo.');
      }
    }
  }

  /**
   * Toggles the expansion state of a row element.
   * This function checks if the specified element exists in the
   * `expandedElements` array. If it exists, the function removes it,
   * otherwise, it adds the element to the array.
   * @param element The row element to be toggled.
   */
  toggleRow(element: string): void {
    const index = this.expandedElements.indexOf(element);
    if (index >= 0) {
      this.expandedElements.splice(index, 1);
    } else {
      this.expandedElements.push(element);
    }
  }

  /**
   * Checks if a row element is expanded.
   * This function checks if the specified element exists in the
   * `expandedElements` array. If it exists, the function returns `true`,
   * indicating the row is expanded. Otherwise, it returns `false`.
   * @param element The row element to check.
   * @returns `true` if the row is expanded, `false` otherwise.
   */
  isRowExpanded(element: string): boolean {
    return this.expandedElements.indexOf(element) >= 0;
  }
}
