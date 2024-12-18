import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';

declare var bootstrap: any;

@Component({
  selector: 'app-center-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent {
  dataSource: MatTableDataSource<any> = new MatTableDataSource([
    {
      name: 'hol',
      adminAreaName: 'jhg',
      adminAreaDescription: 'nbhgvfcd',
      instalationType: 'gfd',
      address: 'kjnhbg',
      monthlyConsumptionLimit: 89,
      formula: 'consumo',
      teamWork: ['Juan', 'Lucia']
    }
  ]);
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

  constructor (
    public global: GlobalModule,
    private dataService: DataService
  ) {}

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
