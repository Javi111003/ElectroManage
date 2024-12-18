import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { Office } from '../../../../../models/office.interface';
import { WorkCenter } from '../../../../../models/workCenter.interface';
import { DataService } from '../../../../../services/data/data.service';
import { GlobalModule } from '../../../../global/global.module';

declare var bootstrap: any;  // Declaración de bootstrap para evitar errores de compilación
@Component({
  selector: 'app-office-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource([
    {
      officeName: 'Oficina Central',
      workCenter: 'Centro A'
    },
    {
      officeName: 'Oficina Sucursal',
      workCenter: 'Centro B'
    }
  ]);
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Nombre',
      field: 'officeName'
    },
    {
      title: 'Centro de Trabajo',
      field: 'workCenter'
    }
  ];

  offices: any[] = [
    { id: 1, officeName: 'Oficina Central', companyId: 101 },
    { id: 2, officeName: 'Oficina Sucursal', companyId: 102 }
  ];

  workCenters: any[] = [
    { id: 1, workCenter: 'Centro A' },
    { id: 2, workCenter: 'Centro B' }
  ];

  constructor (
    public global: GlobalModule,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const officesWithWorkCenter = this.offices.map(office => {
      const workCenter = this.workCenters.find(center => center.id === office.id);
      return {
        ...office,
        'workCenter': workCenter ? workCenter.name : 'No asignado'
      };
    });

    // this.dataSource = new MatTableDataSource(officesWithWorkCenter);
  }

  onClick(): void {
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  delete(): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?').subscribe(
      result => { if (result) {
        this.global.openDialog('Eliminado');
      }
    });
  }

  edit(item: any): void {
    this.dataService.setData(item);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }
}

