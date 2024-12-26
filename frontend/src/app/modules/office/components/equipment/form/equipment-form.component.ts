import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrl: './equipment-form.component.css'
})
export class EquipmentFormComponent {
  @Input() data: any;
  enableAddType: boolean = false;
  enableAddBrand: boolean = false;

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService
  )
  {
    const today = new Date();
    this.form = this.fb.group({
      workCenter: ['', Validators.required],
      office: ['', Validators.required],
      equipmentType: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      useFrequency: ['', Validators.required],
      maintenanceStatus: ['', Validators.required],
      efficiency: [null, Validators.required],
      capacity: [null, Validators.required],
      critical: [null, Validators.required],
      avgConsumption: [null, Validators.required],
      yearsLife: [null, Validators.required],
      instalationDate: [today, Validators.required],
    });
    this.dataService.setData(null);


    this.form.get('equipmentType')!.valueChanges.subscribe(() => {
      if (String(this.getControlValue('equipmentType')).trim() == '') {
        this.enableAddType = false;
        return;
      }

      this.enableAddType = !this.global.isOptionValid(this.types, this.getControlValue('equipmentType'))
    });

    this.form.get('brand')!.valueChanges.subscribe(() => {
      if (String(this.getControlValue('brand')).trim() == '') {
        this.enableAddBrand = false;
        return;
      }

      this.enableAddBrand = !this.global.isOptionValid(this.brands, this.getControlValue('brand'))
    });
  }

  form: FormGroup;
  offices: string[] = [
    'Oficina Central', 'Oficina Sucursal'
  ];

  workCenters: string[] = [
    'Centro A', 'Centro B'
  ];

  useFrequencies: string[] = [
    'Alta', 'Media', 'Baja'
  ];

  maintenanceStatus: string[] = [
    'Bueno', 'Regular', 'Malo'
  ];

  types: string[] = [
    '1', '2'
  ];

  brands: string[] = [
    '1', '2'
  ];

  ngOnInit() {
    this.dataService.currentData.subscribe(newData => {
      if (newData) {
        this.data = newData[0];
        this.form.patchValue(this.data);
        this.getControl('workCenter').setValue(newData[1]);
        this.getControl('office').setValue(newData[2]);
      }
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
    this.enableAddBrand = this.enableAddType = false;
    const today = new Date();
    this.getControl('instalationDate').setValue(today);
  }

  onSubmit(): void {
    console.log("hola");
    if (this.form.invalid) {
      alert('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      console.log(this.form);
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

  filterInstalationDate = (d: Date | null): boolean => {
    const today = new Date();
    const Tday = today.getDate();
    const Tmonth = today.getMonth();
    const Tyear = today.getFullYear();

    const day = d?.getDate();
    const month = d?.getMonth();
    const year = d?.getFullYear();

    if (year !== undefined && month !== undefined && day !== undefined &&
      (year < Tyear || (year === Tyear && (month < Tmonth) || (month === Tmonth && day <= Tday))))
      return true;

    return false
  };

  addType(): void {
    console.log("añadir tipo");
    this.types.push(this.getControlValue('equipmentType'));
  }

  addBrand(): void {
    console.log("añadir marca");
    this.brands.push(this.getControlValue('brand'));
  }
}
