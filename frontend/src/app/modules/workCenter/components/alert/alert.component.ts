import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
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
  isTableActive: boolean = false;
  CenterOptions: string[] = [
    'Centro 1', 'Centro 2', 'Centro 3'
  ];

  onClick() {
    this.isTableActive = !this.isTableActive;
  }

  handleOptionSelected($event: string) {
    throw new Error('Method not implemented.');
  }
}
