import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';

@Component({
  selector: 'app-center-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent implements OnInit {
  enableAddType: boolean = false;
  enableAddArea: boolean = false;

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService
  )
  {
    this.form = this.fb.group({
      name: ['', Validators.required],
      adminAreaName: ['', Validators.required],
      instalationType: ['', Validators.required],
      address: ['', Validators.required],
      policy: '',
      monthlyConsumptionLimit: [null, Validators.required],
      formula: ['', Validators.required],
      teamWork: [[''], Validators.required]
    });
    this.dataService.setData(null);

    this.form.get('instalationType')!.valueChanges.subscribe(() => {
      if (String(this.getControlValue('instalationType')).trim() == '') {
        this.enableAddType = false;
        return;
      }

      this.enableAddType = !this.global.isOptionValid(this.types, this.getControlValue('instalationType'))
    });

    this.form.get('adminAreaName')!.valueChanges.subscribe(() => {
      if (String(this.getControlValue('adminAreaName')).trim() == '') {
        this.enableAddArea = false;
        return;
      }

      this.enableAddArea = !this.global.isOptionValid(this.adminAreas, this.getControlValue('adminAreaName'))
    });
  }

  data: any;
  form: FormGroup;
  teamWork: string[] = [
    'Juan', 'Pedro', 'Lucia', 'Martin'
  ];

  policies: string[] = [
    'jbhg', 'mnbgvc'
  ];

  adminAreas: string[] = [
    'jbhg', 'mnbgvc'
  ];

  types: string[] = [
    'jbhg', 'mnbgvc'
  ];

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

  onCloseModal(): void {
    this.form.reset();
    this.enableAddArea = this.enableAddType = false;
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

  addType(): void {
    console.log("añadir tipo");
    this.types.push(this.getControlValue('instalationType'));
  }

  addArea(): void {
    console.log("añadir area");
    this.adminAreas.push(this.getControlValue('adminAreaName'));
  }
}
