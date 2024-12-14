import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';

@Component({
  selector: 'app-center-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent implements OnInit {
  form: FormGroup; // Formulario reactivo

  constructor(private fb: FormBuilder, public global: GlobalModule) {
    // Creamos el formulario con validaciones
    this.form = this.fb.group({
      officeName: ['', Validators.required],  // Campo nombre de la oficina
      workCenter: ['', Validators.required]    // Campo centro de trabajo
    });
  }

  ngOnInit() {}

  onCloseModal(): void {
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      confirm('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      return;
    }

    const confirmation = confirm('¿Está seguro de que desea guardar los cambios?');
    if (confirmation) {
      window.location.reload();
    }
  }

  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control?.markAsTouched();
    });
  }
}
