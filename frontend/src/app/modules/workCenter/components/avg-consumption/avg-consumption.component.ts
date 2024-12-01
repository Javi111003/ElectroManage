import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { WorkCenterService } from '../../../../services/workCenter/work-center.service';
import { MatTableDataSource } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { GlobalModule } from '../../../global/global.module';

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
    private httpCenter: WorkCenterService,
    public global: GlobalModule
  ) {}

  actualDate: Date = new Date();
  actualYear: number = 0;
  selectedOptions: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [];
  columnsToDisplay = ['Centro de Trabajo'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElements: string[] = [];
  showTable: boolean = false;

  ngOnInit() {
    this.global.Reset();
    this.global.getWorkCenters();
    this.showTable = false;
    this.actualYear = this.actualDate.getFullYear();
    this.displayedColumns = [
      {
        title: 'Centro de Trabajo',
        field: 'workCenter'
      },
      {
        title: `Consumo Promedio (Kw/h) Año ${this.actualYear - 3}`,
        field: 'month'
      },
      {
        title: `Consumo Promedio (Kw/h) Año ${this.actualYear - 2}`,
        field: 'average'
      },
      {
        title: `Consumo Promedio (Kw/h) Año ${this.actualYear - 1}`,
        field: 'cost'
      }
    ];
  }

  /** * Toggles the visibility of the table.
  * Called when the "Consultar" button is clicked.
  */
  onConsultClick() {
    if (this.selectedOptions.length > 0)
      this.showTable = true;
    else
      alert('Por favor, selecciona al menos un Centro de Trabajo.')
  }

  /** * Calculate the proyection of consumption for the next 3 years of the
  * selected work centers.
  * Called when the "Proyección" button is clicked.
  */
  onProyectionClick(){
    alert("No esta implementado perro")
  }

  /** * Handles changes in the selected options for work centers.
  * Updates the selectedOptions array and deactivates the table.
  * @param selected An array of selected options.
  */
  handleSelectionChange(selected: string[]) {
    this.selectedOptions = selected;
    this.showTable=false;
  }
}
