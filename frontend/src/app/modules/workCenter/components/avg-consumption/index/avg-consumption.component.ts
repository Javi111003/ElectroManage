import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


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
export class AvgConsumptionComponent implements OnInit{

  constructor (
    public global: GlobalModule,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      workCenters: []
    });

    this.form.valueChanges.subscribe(() => { this.showTable = false; })
  }

  form: FormGroup;
  selectedOptionsIds: number[] | any [] = [];
  dataSources: { [key: string]: MatTableDataSource<any> } = {};
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Año',
      field: 'year'
    },
    {
      title: 'Costo ($)',
      field: 'meanMonthlyCost'
    },
    {
      title: 'Consumo Promedio (Kw/h)',
      field: 'meanMonthlyConsumption'
    }
  ];

  columnsToDisplay = ['Centro de Trabajo'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElements: string[] = [];
  showTable: boolean = false;

  ngOnInit() {
    this.global.Reset();
    this.global.getWorkCenters();
    this.getControl('workCenters').valueChanges.subscribe(() => {
      this.findCenterIds();
      this.expandedElements = [];
    });
  }

  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  /**
   * Finds the IDs of the selected work centers based on their names.
   * This method iterates over the selectedOptions array and finds the
   * corresponding ID for each option
   * by searching through the global.centerObjectArray. The IDs are
   * stored in the selectedOptionsIds array.
   */
  findCenterIds() {
    this.selectedOptionsIds = this.getControlValue('workCenters').map((item: string) => {
      const id = this.global.centerObjectArray.find(center => center.name === item)?.id
      return id;
    });
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
        const centerName = this.global.centerObjectArray.find(
          item => item.id === registers[index].companyID
        )?.name;

        if (centerName) {
          this.dataSources[centerName] = new MatTableDataSource();
          this.dataSources[centerName].data = registers[index].yearCostDto;
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
      if (this.getControlValue('workCenters').length > 0)
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
