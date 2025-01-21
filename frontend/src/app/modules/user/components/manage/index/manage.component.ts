import { UserService } from './../../../../../services/user/user.service';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { UserLogged } from '../../../../../models/credential.interface';

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
    private httpUser: UserService,
    private snackbar: SnackbarService
  ) {}

  noResults: boolean = false;
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
      field: 'center'
    }
  ];
  selectedItem: any = null;
  rolesMapper: Map<string, string> = new Map<string, string>([
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
    this.dataService.setData([null, true, false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  /**
   * Initiates the deletion process for a user.
   * Opens a dialog to confirm the deletion, and if confirmed, opens another dialog to notify the user of the deletion.
   */
  delete(item: any): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?', true).subscribe(
      result => { if (result) {
        this.httpUser.deleteUser(item.id).subscribe({
          next: (response) => {
            console.log('Deleted successfully:', response);
            this.snackbar.openSnackBar('Eliminado exitosamente...');
            this.dataService.notifyDataUpdated();
          },
          error: (error) => {
            console.log(error);
            this.snackbar.openSnackBar('Error al eliminar, intente de nuevo...');
          }
        });
      }
    });
  }

  /**
   * Prepares the edit modal for a user.
   * Fetches the user details by ID, maps the roles, sets the data service with the user data and false loading state, then shows the modal.
   * @param item The user item to be edited.
   */
  edit(item: any): void {
    this.dataService.setData([item, false, false]);
    const modal = new bootstrap.Modal(
      document.getElementById('exampleModal') as HTMLElement
    );
    modal.show();
  }

  /**
   * Retrieves the list of users and reloads the table data.
   * Subscribes to the user service to get the list of users, then maps the users to the required format and reloads the table data.
   */
  getUserList(): void {
    this.httpUser.getUsersList().subscribe(users => {
      const appUsers: UserLogged[] = users.appUsers;
      this.reloadTableData(appUsers);
    });
  }

  /**
   * Reloads the table data with the provided users data.
   * Maps the users data to the required format and sets it as the data source for the table.
   * @param users The array of users data to be loaded into the table.
   */
  reloadTableData(users: UserLogged[]) {
    this.dataSource.data = users.map(item => ({
      id: item.id,
      userName: item.username,
      email: item.email,
      role: item.roles.map(role => this.rolesMapper.get(role)),
      workCenter: item.company,
      center: item.company.name
    }));

    this.noResults = this.dataSource.data.length == 0;
  }
}
