import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../global/global.module';
import { WorkCenterService } from '../../../../services/workCenter/work-center.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit {
  constructor(
    private httpAlert: WorkCenterService,
    public global: GlobalModule
  ) {}

  isTableActive: boolean = false;
  centerSelected: string = '';
  centerSelectedId: number | any = 0;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [
    {
      title:'Mes/Año',
      field:'date'
    },
    {
      title:'Consumo (kw)',
      field:'consumption'
    },
    {
      title:'Límite Mensual',
      field:'monthlyLimit'
    }
  ];


  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
  }

  onClick() {
    this.findCenterId();
    this.getAlerts(this.centerSelectedId);
    this.isTableActive = !this.isTableActive;
  }

  /** * Finds the ID of the selected center based on its name.
  * @param centerSelected The name of the selected center.
  */
  findCenterId(): void {
    const centerSelected = this.centerSelected;
    this.centerSelectedId = this.global.centerObjectArray.find(item => item.name === centerSelected)?.id;
  }

  getAlerts(centerID: number): void {
    this.httpAlert.getAlerts(centerID).subscribe(alert => {
      this.dataSource.data = alert.warnings.map(item => ({
        date: `${item.month}/${item.year}`,
        consumption: item.consumption,
        monthlyLimit: item.establishedLimit
      }));
    });
  }

  handleOptionSelected(option: string) {
    this.centerSelected = option;
  }
}
