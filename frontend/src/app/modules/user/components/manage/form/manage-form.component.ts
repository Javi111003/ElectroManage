import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../../services/data/data.service';

@Component({
  selector: 'app-user-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
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
  )
  {
    this.form = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      workCenter: ['', Validators.required]
    });
  }

  ngOnInit(): void {
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
