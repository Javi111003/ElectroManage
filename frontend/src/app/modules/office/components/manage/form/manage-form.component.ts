import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';  // Importar Reactive Forms
import { GlobalModule } from '../../../../global/global.module'  // Suponiendo que el GlobalModule existe en tu aplicación
import { DataService } from '../../../../../services/data/data.service';

@Component({
  selector: 'app-office-manage-form',
  templateUrl: './manage-form.component.html',  // Enlazamos el HTML del modal
  styleUrls: ['./manage-form.component.css']   // Puedes agregar estilos aquí si es necesario
})
export class ManageFormComponent implements OnInit {
  data: any;
  form: FormGroup;
  workCenters: string[] = [
    'centro 1', 'centro 2'
  ];

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService
  ) {
    // Creamos el formulario con validaciones
    this.form = this.fb.group({
      officeName: ['', Validators.required],  // Campo nombre de la oficina
      workCenter: ['', Validators.required]    // Campo centro de trabajo
    });
  }

  ngOnInit() {
    this.dataService.currentData.subscribe(newData => {
      this.data = newData;
      this.form.patchValue(this.data);
    });
  }

  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  // Función para manejar el cierre del modal y resetear el formulario
  onCloseModal(): void {
    this.form.reset(); // Reiniciamos el formulario cuando el modal se cierra
  }

  // Función para manejar el envío del formulario
  onSubmit(): void {
    if (this.form.invalid) {
      confirm('Por favor, rellene todos los campos.');
      this.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar errores
      return;
    }

    const confirmation = confirm('¿Está seguro de que desea guardar los cambios?');
    if (confirmation) {
      window.location.reload();  // Recargar la página
    }
  }

  // Marcar todos los campos del formulario como tocados
  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control?.markAsTouched();
    });
  }
}

