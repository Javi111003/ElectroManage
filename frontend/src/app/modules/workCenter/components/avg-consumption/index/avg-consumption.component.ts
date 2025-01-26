import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  showTable: boolean = false;
  dataSources: { [key: string]: MatTableDataSource<any> } = {};
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Año',
      field: 'year'
    },
    {
      title: 'Costo ($)',
      field: 'meanCost'
    },
    {
      title: 'Consumo Promedio (Kw/h)',
      field: 'meanConsumption'
    }
  ];

  constructor (
    public global: GlobalModule,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      workCenters: []
    });

    this.form.valueChanges.subscribe(() => {
      this.showTable = false;
      this.dataSources = {};
    })

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
  getAvgRegisters() {
    this.global.httpCenter.getAvgRegisters(this.selectedOptionsIds).subscribe(registers => {
      for (let index = 0; index < registers.length; index++) {
        const centerName = this.global.workCenters.find(
          item => item.id === registers[index].companyID
        )?.name;

        if (centerName) {
          this.dataSources[centerName] = new MatTableDataSource();
          this.dataSources[centerName].data = registers[index].yearCostDto.map(data => ({
            year: data.year,
            meanCost: data.meanCost.toFixed(2),
            meanConsumption: data.meanConsumption.toFixed(2)
          }));
        }
      }
    });
  }

  /**
   * Toggles the visibility of the table.
   * Called when the "Consultar" button is clicked.
   */
  onConsultClick() {
    if (!this.showTable) {
      const workCenters = this.global.getControlValue(this.form, 'workCenters');
      if (workCenters && workCenters.length > 0)
      {
        this.showTable = true;
        this.getAvgRegisters();
      } else {
        this.global.openDialog('Por favor, selecciona al menos un Centro de Trabajo.');
      }
    }
  }

  /**
   * Calculate the proyection of consumption for the next 3 years of the
   * selected work centers.
   * Called when the "Proyección" button is clicked.
   */
  onProyectionClick() {
    this.global.openDialog('No esta implementado');
    this.dataSources = {};
  }

  /**
   * Toggles the expansion state of a row element.
   * This function checks if the specified element exists in the
   * `expandedElements` array. If it exists, the function removes it,
   * otherwise, it adds the element to the array.
   * @param element The row element to be toggled.
   */
  toggleRow(element: string) {
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
