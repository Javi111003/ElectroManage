import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { RegisterUser } from '../../../../../models/credential.interface';
import { UserService } from '../../../../../services/user/user.service';

@Component({
  selector: 'app-user-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private user: UserService
  )
  {
    this.form = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      workCenter: ['', Validators.required]
    });

    this.dataService.setData(null);
  }

  data: any;
  form: FormGroup;
  TextRoles: string[] = [
    'Administrador', 'Gerente', 'Analista'
  ];
  roles: Map<string, string> = new Map<string, string>([
    ['Administrador', 'Admin'],
    ['Gerente', 'User'],
    ['Analista', 'User']
  ]);

  ngOnInit(): void {
    this.dataService.currentData.subscribe(newData => {
      this.data = newData;
      this.form.patchValue(this.data);
    });

    this.global.getWorkCenters();
  }

  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  onCloseModal(): void {
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      alert('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      return;
    }

    const confirmation = confirm('¿Está seguro de que desea guardar los cambios?');
    if (confirmation) {
      const rolesSelected: string[] = this.getControlValue('role');
      const centerSelected: string = this.getControlValue('workCenter');
      console.log(centerSelected);
      this.global.findCenterId(centerSelected);

      let rolesToPost: string[] = [];

      for (let i = 0; i < rolesSelected.length; i++) {
        rolesToPost.push(this.roles.get(rolesSelected[i])!);
      }

      const registerData: RegisterUser = {
        email: this.getControlValue('name'),
        password: this.getControlValue('password'),
        roles: rolesToPost,
        companyId: this.global.centerSelectedId
      };

      console.log('Register data:', registerData);

      this.user.registerUser(registerData).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error registering user:', error);
          alert('Error al registrar el usuario. Por favor, inténtelo de nuevo.');
        }
      });

      window.location.reload();
    }
  }

  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.getControl(field);
      control?.markAsTouched();
    });
  }
}
