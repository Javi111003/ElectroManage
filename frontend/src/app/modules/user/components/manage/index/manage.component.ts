import { UserService } from './../../../../../services/user/user.service';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { UserInfo } from '../../../../../models/credential.interface';

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
      title: 'ID',
      field: 'id'
    },
    {
      title: 'Usuario',
      field: 'email'
    },
    {
      title: 'Centro de Trabajo',
      field: 'center'
    }
  ];
  selectedItem: any = null;

  ngOnInit() {
    this.getUserList();
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
    this.dataService.setData(item);
    const modal = new bootstrap.Modal(
      document.getElementById('exampleModal') as HTMLElement
    );
    modal.show();
  }

  getUserList(): void {
    this.user.getUsersList().subscribe(users => {
      console.log(users);
      const appUsers: UserInfo[] = users.appUsers;
      this.dataSource.data = appUsers.map(user => ({
        id: user.id,
        email: user.email,
        center: user.company.name
      }));
    });
  }
}
