import { Component, OnInit, signal } from '@angular/core';
import * as L from 'leaflet';
import { Modal } from 'bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { chipElement } from '../../../../../shared/components/chips/chips.component';

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
  formulaVariables: chipElement[] = [
    { id: 0, name: 'consumo' },
    { id: 1, name: 'por_ciento_extra' },
    { id: 2, name: 'aumento' }
  ];

  formulaSymbols: chipElement[] = [
    { id: -1, name: 'C' }, { id: -2, name: '^' },
    { id: -3, name: '\u221A' }, { id: -4, name: '.' },
    { id: -5, name: '7' }, { id: -6, name: '8' },
    { id: -7, name: '9' }, { id: -8, name: '+' },
    { id: -9, name: '4' }, { id: -10, name: '5' },
    { id: -11, name: '6' }, { id: -12, name: '-' },
    { id: -13, name: '1' }, { id: -14, name: '2' },
    { id: -15, name: '3' }, { id: -16, name: '*' },
    { id: -17, name: '(' }, { id: -18, name: '0' },
    { id: -19, name: ')' }, { id: -20, name: '/' }
  ];

  options = signal([
    { id: 0, name: 'consumo' },
    { id: -16, name: '*' },
    { id: -17, name: '(' },
    { id: -13, name: '1' },
    { id: -8, name: '+' },
    { id: 1, name: 'por_ciento_extra' },
    { id: -19, name: ')' },
    { id: -8, name: '+' },
    { id: 2, name: 'aumento' }
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

    this.addElementFormula();
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
      { id: 0, name: 'consumo' },
      { id: -16, name: '*' },
      { id: -17, name: '(' },
      { id: -13, name: '1' },
      { id: -8, name: '+' },
      { id: 1, name: 'por_ciento_extra' },
      { id: -19, name: ')' },
      { id: -8, name: '+' },
      { id: 2, name: 'aumento' }
    ]);


    this.addElementFormula();
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
    this.types.push(this.getControlValue('instalationType'));
  }

  addArea(): void {
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

  addElementFormula(): void {
    const names = this.options().map(option => option.name);
    this.form.patchValue({
      formula: names.join(' ')
    });

    this.assignValues();
  }

  addSymbolFormula(option: chipElement): void {
    if (option.name === 'C') {
      this.options = signal([]);
      this.addElementFormula();
      return;
    }

    this.options = signal([...this.options(), option]);
    this.addElementFormula();
  }

  validateOption(option: string): boolean {
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const symbols = ['`', '~', '%', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', '\\', ':', ';', '"', '\'', '<', '>', ',', '.', '?', '/'];

    if (numbers.includes(option[0]) || symbols.find(symbol => option.includes(symbol)) != undefined) {
      return false;
    }

    return true;
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
      if (this.formulaSymbols.every(symbol => symbol.id != option.id && symbol.name != option.name)
        && option.name != 'consumo' && !usedOptions.includes(option.name)) {

        this.form.addControl(option.name, this.fb.control('', Validators.required));
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
          label.htmlFor = option.name;
          label.innerText = option.name;

          const input = document.createElement('input');
          input.type = 'number';
          input.className = 'form-control';
          input.id = option.name;

          column.appendChild(label);
          column.appendChild(input);
          if (row) {
            row.appendChild(column);
          }

          i++;
          usedOptions.push(option.name);
        }
      }
    }
  }
}
