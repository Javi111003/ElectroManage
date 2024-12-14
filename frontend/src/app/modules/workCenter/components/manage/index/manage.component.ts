import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Office } from '../../../../../models/office.interface';
import { WorkCenter } from '../../../../../models/workCenter.interface';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';

declare var bootstrap: any;

@Component({
  selector: 'app-center-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Nombre',
      field: 'name'
    },
    {
      title: 'Nombre Área Administrativa',
      field: 'adminAreaName'
    },
    {
      title: 'Descripción Área Administrativa',
      field: 'adminAreaDescription'
    },
    {
      title: 'Tipo de instalación',
      field: 'instalationType'
    },
    {
      title: 'Ubicación',
      field: 'address'
    },
    {
      title: 'Límite',
      field: 'monthlyConsumptionLimit'
    },
    {
      title: 'Fórmula de Costo Total',
      field: 'formula'
    },
    {
      title: 'Equipo Responsable',
      field: 'teamWork'
    }
  ];

  ngOnInit() {}

  onClick(): void {
      const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
      modal.show();
  }
}
