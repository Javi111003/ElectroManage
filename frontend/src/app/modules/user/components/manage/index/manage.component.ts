import { UserService } from './../../../../../services/user/user.service';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { UserById, UserInfo } from '../../../../../models/credential.interface';

declare var bootstrap: any;

@Component({
  selector: 'app-user-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent {

  constructor (
    public global: GlobalModule,
    private dataService: DataService,
    private user: UserService
  ) {}

  dataSource: MatTableDataSource<any> = new MatTableDataSource([0]);
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Usuario',
      field: 'userName'
    },
    {
      title: 'Correo',
      field: 'email'
    },
    {
      title: 'Centro de Trabajo',
      field: 'workCenter'
    }
  ];
  selectedItem: any = null;
  roles: Map<string, string> = new Map<string, string>([
    ['Admin', 'Administrador'],
    ['Manager', 'Gerente'],
    ['Analist', 'Analista']
  ]);

  ngOnInit() {
    this.getUserList();
    this.dataService.dataUpdated$.subscribe(() => {
      this.getUserList();
    });
  }

  onAddClick(): void {
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
    this.user.getById(item.id).subscribe(user => {
      item.role = user.roles.map(item => this.roles.get(item));
      this.dataService.setData(item);
      const modal = new bootstrap.Modal(
        document.getElementById('exampleModal') as HTMLElement
      );
      modal.show();
    });
  }

  getUserList(): void {
    this.user.getUsersList().subscribe(users => {
      const appUsers: UserInfo[] = users.appUsers;
      this.reloadTableData(appUsers);
    });
  }

  reloadTableData(offices: any[]) {
    this.dataSource.data = offices.map(item => ({
      id: item.id,
      userName: item.username,
      email: item.email,
      password: item.password,
      workCenter: item.company.name
    }));
  }
}
