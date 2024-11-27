import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { WorkCenterService } from '../../../../services/workCenter/work-center.service';
import { MatTableDataSource } from '@angular/material/table';
import { WorkCenter } from '../../../../models/workCenter.interface';
import {animate, state, style, transition, trigger} from '@angular/animations';

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
    private httpCenter: WorkCenterService
  ) {}

  CenterOptions: string[] = [];
  CenterObjects: WorkCenter[] = [];
  selectedOptions: string[] = [];
  isTableActive: boolean = false;
  dataSources: { [key: string]: MatTableDataSource<any> } = {};
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Mes',
      field: 'month'
    },
    {
      title: 'Consumo Promedio (Kw/h)',
      field: 'average'
    },
    {
      title: 'Costo ($)',
      field: 'cost'
    }
  ];
  columnsToDisplay = ['Centro de Trabajo'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElements: string[] = [];

  ngOnInit() {
    this.getWorkCenterList();
    this.isTableActive = false;
  }

  /** * Retrieves the list of work centers from the WorkCenterService.
  * Updates the CenterOptions and CenterObjects arrays with the fetched work centers.
  */
  getWorkCenterList() {
    this.httpCenter.getWorkCenterList().subscribe(workCenters => {
      this.CenterObjects = workCenters;
      this.CenterOptions = workCenters.map(item => item.name);
    })
  }

  /** * Toggles the visibility of the table.
  * Called when the "Consultar" button is clicked.
  */
  onConsultClick() {
    this.isTableActive = !this.isTableActive;
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
    this.isTableActive=false;
  }

  toggleRow(element: string) {
    const index = this.expandedElements.indexOf(element);
    if (index >= 0) {
      this.expandedElements.splice(index, 1);
    } else {
      this.expandedElements.push(element);
    }
  }

  isRowExpanded(element: string): boolean {
    return this.expandedElements.indexOf(element) >= 0;
  }
}
