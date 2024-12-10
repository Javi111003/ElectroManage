import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { Office } from '../../../../../models/office.interface';
import { WorkCenter } from '../../../../../models/workCenter.interface';

declare var bootstrap: any;  // Declaración de bootstrap para evitar errores de compilación
@Component({
  selector: 'app-office-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit { 
  // Propiedades de la tabla
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Nombre',
      field: 'name'
    },
    {
      title: 'Centro de Trabajo',
      field: 'work-center'
    }
  ];

  // Datos de oficina y centro de trabajo
  offices: Office[] = [
    { id: 1, name: 'Oficina Central', companyId: 101 },
    { id: 2, name: 'Oficina Sucursal', companyId: 102 }
  ];

  workCenters: WorkCenter[] = [
    { id: 1, name: 'Centro A' },
    { id: 2, name: 'Centro B' }
  ];

  ngOnInit() {
    // Transformar los datos de las oficinas para incluir los centros de trabajo
    const officesWithWorkCenter = this.offices.map(office => {
      const workCenter = this.workCenters.find(center => center.id === office.id);
      return {
        ...office,
        'work-center': workCenter ? workCenter.name : 'No asignado'
      };
    });

    // Asignar los datos a la tabla
    this.dataSource = new MatTableDataSource(officesWithWorkCenter);
  }
  // Función para abrir el modal cuando se hace clic en el botón "Crear Oficina"
  onClick(): void {
      const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
      modal.show();
  }
}

