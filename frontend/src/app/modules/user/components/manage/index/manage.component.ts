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

  /**
   * Handles the click event for adding a new user.
   * Sets the data service with null data and false loading state, then shows the modal.
   */
  onAddClick(): void {
    this.dataService.setData([null, false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  /**
   * Initiates the deletion process for a user.
   * Opens a dialog to confirm the deletion, and if confirmed, opens another dialog to notify the user of the deletion.
   */
  delete(): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?', true).subscribe(
      result => { if (result) {
        this.global.openDialog('Eliminado');
      }
    });
  }

  /**
   * Prepares the edit modal for a user.
   * Fetches the user details by ID, maps the roles, sets the data service with the user data and false loading state, then shows the modal.
   * @param item The user item to be edited.
   */
  edit(item: any): void {
    this.user.getById(item.id).subscribe(user => {
      item.role = user.roles.map(item => this.roles.get(item));
      this.dataService.setData([item, false]);
      const modal = new bootstrap.Modal(
        document.getElementById('exampleModal') as HTMLElement
      );
      modal.show();
    });
  }

  /**
   * Retrieves the list of users and reloads the table data.
   * Subscribes to the user service to get the list of users, then maps the users to the required format and reloads the table data.
   */
  getUserList(): void {
    this.user.getUsersList().subscribe(users => {
      const appUsers: UserInfo[] = users.appUsers;
      this.reloadTableData(appUsers);
    });
  }

  /**
   * Reloads the table data with the provided offices data.
   * Maps the offices data to the required format and sets it as the data source for the table.
   * @param offices The array of offices data to be loaded into the table.
   */
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
