import { Component, OnDestroy, OnInit, Renderer2, signal } from '@angular/core';
import * as L from 'leaflet';
import { Modal } from 'bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { AdminArea, CenterPropertyInfo, InstallationType } from '../../../../../models/workCenter.interface';
import { Subscription } from 'rxjs';
import { map_URL } from '../../../../../config/api.config';
import { Item } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-center-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  enableAddType: boolean = false;
  enableAddArea: boolean = false;
  postMethod: boolean = true;
  locationConfirm: boolean = true;
  loading: boolean = false;

  private map!: L.Map;
  private marker!: L.Marker;
  private modal!: Modal;

  formulaVariables: Item[] = [
    { id: 0, name: 'consumo' },
    { id: 1, name: 'por_ciento_extra' },
    { id: 2, name: 'aumento' }
  ];

  formulaSymbols: Item[] = [
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
    private dataService: DataService,
    private renderer: Renderer2
  )
  {
    this.form = this.fb.group({
      name: ['', Validators.required],
      adminAreaName: ['', Validators.required],
      instalationType: ['', Validators.required],
      policy: '',
      monthlyConsumptionLimit: [null, Validators.required],
      formula: ['', Validators.required],
      teamWork: [],
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

      this.enableAddType = !this.global.isOptionValid(
        this.typeStringArray, this.getControlValue('instalationType')
      );
    });

    this.form.get('adminAreaName')!.valueChanges.subscribe(() => {
      if (String(this.getControlValue('adminAreaName')).trim() == '') {
        this.enableAddArea = false;
        return;
      }

      this.enableAddArea = !this.global.isOptionValid(
        this.areaStringArray, this.getControlValue('adminAreaName')
      );
    });
  }

  data: any;
  form: FormGroup;
  teamWork: Item[] = [
    { id: 1, name: 'Juan' }, { id: 1, name: 'Pedro' },
    { id: 1, name: 'Lucia' }, { id: 1, name: 'Martin' }
  ];

  policies: string[] = [
    'jbhg', 'mnbgvc'
  ];

  typeStringArray: string[] = [];
  typeArray: Item[] = [];
  typeObjectArray: CenterPropertyInfo[] = [];

  areaStringArray: string[] = [];
  areaArray: Item[] = [];
  areaObjectArray: CenterPropertyInfo[] = [];

  ngOnInit() {
    const sub = this.dataService.currentData.subscribe(newData => {
      if (newData) {
        this.data = newData[0];
        this.form.patchValue(this.data);
        if (this.data) {
          if (this.data.applyingDate) {
            const dateString = this.data.applyingDate;
            const dateParts = dateString.split('-');
            const dateObject = new Date(Date.UTC(+dateParts[0], +dateParts[1] - 1, +dateParts[2] + 1));
            this.getControl('applyingDate').setValue(dateObject);
          }
        }
        this.postMethod = newData[1];
        this.loading = newData[2];
      }
    });

    this.subscriptions.add(sub);

    this.addElementFormula();
    this.getAreas();
    this.getTypes();
  }

  ngOnDestroy(): void {
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
    this.loading = true;
    console.log(this.form);
    if (this.form.invalid) {
      this.global.openDialog('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      this.loading = false;
      return;
    }

    const searchFrom = [
      this.areaStringArray, this.typeStringArray, this.policies
    ];
    const options = [
      this.getControlValue('adminAreaName'), this.getControlValue('instalationType'),
      this.getControlValue('policy')
    ];
    const response = [
      'Nombre de Área', 'Tipo de Instalación', 'Nombre de Política'
    ];
    const valid = this.global.AllValid(searchFrom, options, response);

    if(valid[1] == 'Nombre de Política' && this.getControlValue('policy') === "")
      valid[0] = true;

    if (valid[0]) {
      const confirmation = confirm('¿Está seguro de que desea guardar los cambios?');
      if (confirmation) {
        if (this.postMethod)
          this.createCenter();
        else {
          this.editCenter();
        }
      }
    } else {
      this.global.openDialog(`Por favor, selecciona un ${valid[1]} válido.`);
    }
  }

  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.getControl(field);
      control?.markAsTouched();
    });
  }

  addType(): void {
    this.enableAddType = false;
    const instType: InstallationType = {
      name: this.getControlValue('instalationType'),
      description: null
    };

    this.global.httpCenter.postInstallationType(instType).subscribe({
      next: (response) => {
        console.log('Created successfully:', response);
        this.getTypes();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  /**
   * Retrieves the list of installation types.
   * This function fetches the list of installation types from the server and updates the component's state.
   * It populates the `typeObjectArray` with the fetched types and `typeStringArray` with their names.
   */
  getTypes(): void {
    this.global.httpCenter.getInstallationType().subscribe(types => {
      this.typeObjectArray = types;
      this.typeStringArray = types.map(type => type.name);
      this.typeArray = types.map(type => {
        return {
          id: type.id,
          name: type.name
        }
      });
    });
  }

  /**
   * Deletes an installation type.
   * This function is used to remove an installation type from the system.
   * It finds the ID of the type to be deleted, posts the deletion request to the server,
   * and if successful, retrieves the updated list of types.
   * @param type The name of the installation type to be deleted.
   */
  deleteType(type: string): void {
    const typeID = this.global.findID(this.typeArray, type);
    this.global.httpCenter.deleteInstallationType(typeID).subscribe({
      next: (response) => {
        console.log('Deleted successfully:', response);
        this.getTypes();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addArea(): void {
    this.enableAddArea = false;

    const area: AdminArea = {
      name: this.getControlValue('adminAreaName'),
      description: null
    };

    this.global.httpCenter.postAdminArea(area).subscribe({
      next: (response) => {
        console.log('Created successfully:', response);
        this.getTypes();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  /**
   * Retrieves the list of administrative areas.
   * This function fetches the list of administrative areas from the server and updates the component's state.
   * It populates the `areaObjectArray` with the fetched areas and `areaStringArray` with their names.
   */
  getAreas(): void {
    this.global.httpCenter.getAdminAreas().subscribe(areas => {
      this.areaObjectArray = areas;
      this.areaStringArray = areas.map(area => area.name);
      this.areaArray = areas.map(area => {
        return {
          id: area.id,
          name: area.name
        }
      });
    });
  }

  /**
   * Deletes an administrative area.
   * This function is used to remove an administrative area from the system.
   * It finds the ID of the area to be deleted, posts the deletion request to the server,
   * and if successful, retrieves the updated list of areas.
   * @param area The name of the area to be deleted.
   */
  deleteArea(area: string): void {
    const areaID = this.global.findID(this.areaArray, area);
    this.global.httpCenter.deleteAdminArea(areaID).subscribe({
      next: (response) => {
        console.log('Deleted successfully:', response);
        this.getAreas();
      },
      error: (error) => {
        console.log(error);
      }
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

  openMapModal() {
    this.locationConfirm = true;
    this.loading = false;
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
      this.locationConfirm = false;
      const position = this.marker.getLatLng();
      this.getAddressFromCoordinates(position.lat, position.lng);
    }
  }

  async getAddressFromCoordinates(lat: number, lng: number): Promise<void> {
    const response: any = await fetch(`${map_URL}&lat=${lat}&lon=${lng}`);

    const data: any = await response.json();
    this.form.patchValue({
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
      location: data.display_name
    });
    this.modal.hide();
  }

  addElementFormula(): void {
    const names = this.options().map(option => option.name);
    this.form.patchValue({
      formula: names.join(' ')
    });

    this.assignValues();
  }

  addSymbolFormula(option: Item): void {
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
    const symbols = [
      '`', '~', '%', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
      '-', '_', '+', '=', '{', '}', '[', ']', '|', '\\', ':', ';',
      '"', '\'', '<', '>', ',', '.', '?', '/'
    ];

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

  /**
   * Creates a new work center.
   * This function gathers the necessary information from the form controls and
   * creates a new work center.
   * The work center is then posted to the server for creation.
   */
  createCenter(): void {
    // const commonValues = this.getCommonValues();
    // const specification: EquipmentSpecification = {
    //   model: commonValues.model,
    //   capacity: commonValues.capacity,
    //   criticalEnergySystem: commonValues.critical,
    //   averageConsumption: commonValues.avgConsumption,
    //   lifeSpanYears: commonValues.lifeSpanYears,
    //   efficiency: commonValues.efficiency,
    //   equipmentBrandId: commonValues.brandID,
    //   equipmentTypeId: commonValues.typeID
    // };
    // this.createOrEditSpecification(false, specification, commonValues);
    console.log(this.getControlValue('formula'));
  }

  /**
   * Edits a work center.
   * This function gathers the necessary information from the form controls
   * and edits a work center.
   * The work center is then put to the server for edition.
   */
  editCenter(): void {
    // const commonValues = this.getCommonValues();
    // const specification: EquipmentSpecificationEdited = {
    //   id: this.data.specifId,
    //   model: commonValues.model,
    //   capacity: commonValues.capacity,
    //   criticalEnergySystem: commonValues.critical,
    //   averageConsumption: commonValues.avgConsumption,
    //   lifeSpanYears: commonValues.lifeSpanYears,
    //   efficiency: commonValues.efficiency,
    //   equipmentBrandId: commonValues.brandID,
    //   equipmentTypeId: commonValues.typeID
    // };
    // this.createOrEditSpecification(true, specification, commonValues);
  }

  /**
   * This function is used to get the common values from the form controls.
   * It retrieves the necessary information from the form controls and returns them as an object.
   * @returns An object containing the common values from the form controls.
   */
  getCommonValues() {
    // const typeID = this.findId(this.getControlValue('type'), this.typeObjectArray);
    // const brandID = this.findId(this.getControlValue('brand'), this.brandObjectArray);
    // const useFrequency = this.useFrequencyMatch.get(this.getControlValue('useFrequency'))!;
    // const maintenanceStatus = this.maintenanceStatusMatch.get(this.getControlValue('maintenanceStatus'))!;
    // const model = this.getControlValue('model');
    // const capacity = this.getControlValue('capacity');
    // const critical = this.getControlValue('criticalEnergySystem');
    // const avgConsumption = this.getControlValue('averageConsumption');
    // const lifeSpanYears = this.getControlValue('lifeSpanYears');
    // const efficiency = this.getControlValue('efficiency');
    // const installDate = this.getControlValue('instalationDate');
    // const office = this.getControlValue('office');

    // this.global.findOfficeId(office);

    // return {
    //   typeID, brandID, useFrequency, maintenanceStatus, model, capacity, critical,
    //   avgConsumption, lifeSpanYears, efficiency, installDate
    // };
  }


  /**
   * This function is used to activate the close button of the modal.
   * It retrieves the close button element and simulates a click event on it,
   * effectively closing the modal.
   */
  activateCloseButton(): void {
    const closeButton = document.getElementById('close-button') as HTMLButtonElement;
    closeButton.click();
  }

  assignValues(): void {
    this.clearForm();

    let i = 0;
    let row: HTMLDivElement | null = null;
    let usedOptions: string[] = [];
    for (const option of this.options()) {
      if (this.formulaSymbols.every(symbol => symbol.id != option.id && symbol.name != option.name)
        && option.name != 'consumo' && !usedOptions.includes(option.name)) {

        const control = this.fb.control('', [Validators.required, Validators.pattern(/^[0-9]+$/)]);
        this.form.addControl(option.name, control);
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

          const input = this.renderer.createElement('input');
          this.renderer.setAttribute(input, 'type', 'number');
          this.renderer.setAttribute(input, 'class', 'form-control');
          this.renderer.setAttribute(input, 'id', option.name);
          this.renderer.listen(input, 'input', (event) => {
            control.setValue(event.target.value);
          });

          const errorDiv = this.renderer.createElement('div');
          const errorRequired = this.renderer.createElement('div');
          const errorPattern = this.renderer.createElement('div');

          this.renderer.setAttribute(errorRequired, 'class', 'error-required');
          this.renderer.setAttribute(errorPattern, 'class', 'error-pattern');
          this.renderer.setStyle(errorDiv, 'color', 'red');

          this.renderer.appendChild(errorDiv, errorRequired);
          this.renderer.appendChild(errorDiv, errorPattern);

          this.renderer.listen(input, 'blur', () => {
            errorPattern.innerText = control.hasError('pattern') ? 'Debe ser un número válido.' : '';
            errorRequired.innerText = control.hasError('required') ? 'El campo es requerido.' : '';
          });

          column.appendChild(label);
          column.appendChild(input);
          column.appendChild(errorDiv);
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
