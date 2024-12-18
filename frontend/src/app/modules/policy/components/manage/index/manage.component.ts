import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';

declare var bootstrap: any;  // Declaración de bootstrap para evitar errores de compilación
@Component({
  selector: 'app-policy-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent {

  constructor (
    public global: GlobalModule,
    private dataService: DataService
  ) {}

  dataSource: MatTableDataSource<any> = new MatTableDataSource(
    [
      {
        policyName: 'hola',
        description: 'njhbgv',
        workCenter: 'kjhbvgv'
      }
    ]
  );
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Nombre',
      field: 'policyName'
    },
    {
      title: 'Descripcion',
      field: 'description'
    },
    {
      title: 'Centro de Trabajo',
      field: 'workCenter'
    },
  ];

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
