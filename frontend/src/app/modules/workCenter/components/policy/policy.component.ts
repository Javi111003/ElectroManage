import { GlobalModule } from './../../../global/global.module';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.css'
})
export class PolicyComponent implements OnInit {
  constructor(
    public global: GlobalModule
  ) {}

  optionsPolicy: string[] = [];
  isTableActive: boolean = false;
  dataSourceBefore: MatTableDataSource<any> = [][0];
  dataSourceAfter: MatTableDataSource<any> = [][0];
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Día',
      field: 'registerDate'
    },
    {
      title: 'Consumo (Kw/h)',
      field: 'consumption'
    },
    {
      title: 'Costo ($)',
      field: 'cost'
    }
  ];


  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
  }

  onClick() {
    this.isTableActive = !this.isTableActive;
  }
}
