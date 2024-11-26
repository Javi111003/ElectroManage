import { DateFilterFn } from '@angular/material/datepicker';
import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { WorkCenterService } from '../../../../services/workCenter/work-center.service';
import { MatTableDataSource } from '@angular/material/table';
import { WorkCenter } from '../../../../models/workCenter.interface';
import { Register } from '../../../../models/register.interface';

@Component({
  selector: 'app-avg-consumption',
  templateUrl: './avg-consumption.component.html',
  styleUrl: './avg-consumption.component.css',
})
export class AvgConsumptionComponent {
  constructor (
    private httpService: WorkCenterService
  ) {}
  options: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
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
  footerTable: any[] = [];

  onConsultar() {
    this.isTableActive = !this.isTableActive;
  }
  onProyeccion(){
    alert("No esta implementado perro")
  }

  handleSelectionChange(selected: string[]) {
    this.selectedOptions = selected;
    console.log('Opciones seleccionadas en el componente padre:', this.selectedOptions);
    this.isTableActive=false;
  }
}
