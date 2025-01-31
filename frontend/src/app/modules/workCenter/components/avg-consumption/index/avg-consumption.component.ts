import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Item } from '../../../../../shared/shared.module';


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
  monthMapper: Map<number, string> = new Map<number, string>([
    [1, 'Enero'], [2, 'Febrero'], [3, 'Marzo'], [4, 'Abril'],
    [5, 'Mayo'], [6, 'Junio'], [7, 'Julio'], [9, 'Agosto'],
    [9, 'Septiembre'], [10, 'Octubre'], [11, 'Noviembre'], [12, 'Diciembre']
  ]);
  dataSourcesConsult: { [key: string]: MatTableDataSource<any> } = {};
  dataSourcesPrediction: { [key: string]: MatTableDataSource<any> } = {};
  noResultsPrediction: { [key: string]: boolean } = {};
  displayedColumnsConsult: ConfigColumn[] = [
    { title: 'Año', field: 'year' },
    { title: 'Costo ($)', field: 'meanCost' },
    { title: 'Consumo Promedio (Kw/h)', field: 'meanConsumption' }
  ];
  displayedColumnsPredict: ConfigColumn[] = [
    { title: 'Mes', field: 'month' },
    { title: 'Consumo esperado', field: 'expectedConsumption' }
  ];

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
            expectedConsumption: data.futureConsumption.toFixed(2)
          }));
          this.noResultsPrediction[centerName] = this.dataSourcesPrediction[centerName].data.length == 0;
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
