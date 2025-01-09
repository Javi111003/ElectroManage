import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  @Input() data: any;
  private subscriptions: Subscription = new Subscription();
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService
  )
  {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    this.form = this.fb.group({
      workCenter: ['', Validators.required],
      date: [yesterday, Validators.required],
      consumption: [null, Validators.required],
    });

    this.dataService.setData(null);
  }

  form: FormGroup;

  workCenters: string[] = [
    'Centro A', 'Centro B'
  ];

  ngOnInit() {
    const sub = this.dataService.currentData.subscribe(newData => {
      if (newData) {
        if (newData[0]) {
          this.data = newData[0];
          this.form.patchValue(this.data);
          const dateString = this.data.registerDate;
          const dateParts = dateString.split('-');
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1;
          const day = parseInt(dateParts[2], 10);
          this.getControl('date').setValue(new Date(year, month, day));
        }
        if (newData[1])
          this.getControl('workCenter').setValue(newData[1]);

        this.loading = newData[2];
      }
    });

    this.subscriptions.add(sub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  onCloseModal(): void {
    this.form.reset();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    this.getControl('date').setValue(yesterday);
  }

  onSubmit(): void {
    this.loading = true;
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

  filterDate = (d: Date | null): boolean => {
    const today = new Date();
    const Tday = today.getDate();
    const Tmonth = today.getMonth();
    const Tyear = today.getFullYear();

    const day = d?.getDate();
    const month = d?.getMonth();
    const year = d?.getFullYear();

    if (year !== undefined && month !== undefined && day !== undefined &&
      (year < Tyear || (year === Tyear && (month < Tmonth) || (month === Tmonth && day < Tday))))
      return true;

    return false
  };
}
