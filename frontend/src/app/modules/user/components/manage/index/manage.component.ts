import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';

declare var bootstrap: any;

@Component({
  selector: 'app-user-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent {

  constructor (
    public global: GlobalModule,
    private dataService: DataService
  ) {}

  dataSource: MatTableDataSource<any> = new MatTableDataSource([
    {
      name: 'kmjhg',
      role: 'jh',
      workCenter: '1'
    }
  ]);
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Usuario',
      field: 'name'
    },
    {
      title: 'Rol',
      field: 'role'
    },
    {
      title: 'Centro de Trabajo',
      field: 'workCenter'
    }
  ];
  selectedItem: any = null;

  ngOnInit() {}

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
    this.selectedItem = item;
    this.dataService.setData(item);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }
}
