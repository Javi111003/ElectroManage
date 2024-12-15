import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';

@Component({
  selector: 'app-center-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule)
  {
    this.form = this.fb.group({
      name: ['', Validators.required],
      adminAreaName: ['', Validators.required],
      adminAreaDescription: '',
      instalationType: ['', Validators.required],
      address: ['', Validators.required],
      monthlyConsumptionLimit: [null, Validators.required],
      formula: ['', Validators.required],
      teamWork: [[''], Validators.required]
    });
  }

  form: FormGroup;
  workers: string[] = [
    'Juan', 'Pedro', 'Lucia', 'Martin'
  ];

  ngOnInit() {}

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
