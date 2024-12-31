import { Component, OnInit, signal } from '@angular/core';
import * as L from 'leaflet';
import { Modal } from 'bootstrap';
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
  private map!: L.Map;
  private marker!: L.Marker;
  private modal!: Modal;
  formulaVariables: string[] = [
    'consumo', 'por ciento extra', 'aumento',
  ];

  formulaSymbols: string[] = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '+', '-', '*', '/', '^', '\u221A', '(', ')'
  ];

  options = signal([
    'consumo', '*', '(', '1', '+', 'por ciento extra', ')', '+', 'aumento'
  ]);

  myControls: string[] = [
    'name', 'adminAreaName', 'instalationType', 'policy', 'monthlyConsumptionLimit',
    'formula', 'teamWork', 'latitude', 'longitude', 'location', 'applyingDate'
  ];

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
      policy: '',
      monthlyConsumptionLimit: [null, Validators.required],
      formula: ['', Validators.required],
      teamWork: [[''], Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      location: ['', Validators.required],
      applyingDate: null
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

    this.addElementFormula(this.options());
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
    this.clearForm();
    this.form.patchValue({
      name: '',
      adminAreaName: '',
      instalationType: '',
      policy: '',
      monthlyConsumptionLimit: null,
      formula: '',
      teamWork: [],
      latitude: null,
      longitude: null,
      location: '',
      applyingDate: null
    });
    this.enableAddArea = this.enableAddType = false;
    this.options = signal([
      'consumo', '*', '(', '1', '+', 'por ciento extra', ')', '+', 'aumento'
    ]);
    this.addElementFormula(this.options());
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

  openMapModal() {
    const mapModalElement = document.getElementById('mapModal');
    if (mapModalElement) {
      this.modal = new Modal(mapModalElement);
    }
    this.modal.show();

    setTimeout(() => {
      if (!this.map) {
        this.map =L.map('map').setView([22, -80], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
          if (this.marker) {
            this.map.removeLayer(this.marker);
          }

          const customIcon = L.divIcon({
            html: '<mat-icon class="material-icons" style="color: #00203b; font-size: 32px;">location_on</mat-icon>',
            className: 'custom-div-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          });

          this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map);
        });
      }
    }, 500);
  }

  async confirmLocation() {
    if (this.marker) {
      const position = this.marker.getLatLng();
      const location = await this.getAddressFromCoordinates(position.lat, position.lng);
      this.form.patchValue({
        latitude: position.lat.toFixed(6),
        longitude: position.lng.toFixed(6),
        location: location
      });
      console.log(this.getControlValue('location'));
    }
    this.modal.hide();
  }

  async getAddressFromCoordinates(lat: number, lng: number) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      return '';
    }
  }

  addElementFormula(options: string[]): void {
    this.form.patchValue({
      formula: this.options().join(' ')
    });
  }

  addSymbolFormula(option: string): void {
    this.options = signal([...this.options(), option]);
    this.addElementFormula(this.options());
  }

  clearForm(): void {
    Object.keys(this.form.controls).forEach(controlName => {
      if (!this.myControls.includes(controlName)) {
        this.form.removeControl(controlName);
      }
    });

    const formContainer = document.getElementsByClassName('row mb-3');
    if (formContainer) {
      for (let i = 0; i < formContainer.length; i++) {
        formContainer[i].remove();
      }
    }
  }

  assignValues(): void {
    this.clearForm();

    let i = 0;
    let row: HTMLDivElement | null = null;
    let usedOptions: string[] = [];
    for (const option of this.options()) {
      if (!this.formulaSymbols.includes(option) && option != 'consumo' && !usedOptions.includes(option)) {
        this.form.addControl(option, new FormControl('', Validators.required));
        const formContainer = document.getElementById('form-container');
        if (formContainer) {
          if (i % 3 == 0) {
            row = document.createElement('div');
            row.className = 'row mb-3';
            formContainer.appendChild(row);
          }

          const column = document.createElement('div');
          column.className = 'col-sm-4';

          const label = document.createElement('label');
          label.htmlFor = option;
          label.innerText = option;

          const input = document.createElement('input');
          input.type = 'number';
          input.className = 'form-control';
          input.id = option;
          input.name = option;

          column.appendChild(label);
          column.appendChild(input);
          if (row) {
            row.appendChild(column);
          }

          i++;
          usedOptions.push(option);
        }
      }
    }
  }
}
