import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import * as L from 'leaflet';
import { Modal } from 'bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { chipElement } from '../../../../../shared/components/chips/chips.component';
import { AdminArea, CenterPropertyInfo, InstallationType } from '../../../../../models/workCenter.interface';
import { Subscription } from 'rxjs';

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
  teamWork: string[] = [
    'Juan', 'Pedro', 'Lucia', 'Martin'
  ];

  policies: string[] = [
    'jbhg', 'mnbgvc'
  ];

  areaStringArray: string[] = [];
  typeStringArray: string[] = [];
  typeObjectArray: CenterPropertyInfo[] = [];
  areaObjectArray: CenterPropertyInfo[] = [];

  ngOnInit() {
    const sub = this.dataService.currentData.subscribe(newData => {
      if (newData) {
        this.data = newData[0];
        const post = newData[1];
        this.form.patchValue(this.data);
        if (this.data) {
          if (this.data.applyingDate) {
            const dateString = this.data.applyingDate;
            const dateParts = dateString.split('-');
            const dateObject = new Date(Date.UTC(+dateParts[0], +dateParts[1] - 1, +dateParts[2] + 1));
            this.getControl('applyingDate').setValue(dateObject);
          }
        }
        this.postMethod = post;
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
    if (this.form.invalid) {
      this.global.openDialog('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
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
          this.postMethod = true;
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
        if (error.status === 0) {
          this.global.openDialog("Error inesperado al conectar con el servidor.");
        }
        else
          this.global.openDialog(error.error.errors[0].reason);
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
    const typeID = this.findId(type, this.typeObjectArray);
    this.global.httpCenter.deleteInstallationType(typeID).subscribe({
      next: (response) => {
        console.log('Deleted successfully:', response);
        this.getTypes();
      },
      error: (error) => {
        if (error.status === 0) {
          this.global.openDialog("Error inesperado al conectar con el servidor.");
        }
        else
          this.global.openDialog(error.error.errors[0].reason);
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
        if (error.status === 0) {
          this.global.openDialog("Error inesperado al conectar con el servidor.");
        }
        else
          this.global.openDialog(error.error.errors[0].reason);
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
    const areaID = this.findId(area, this.areaObjectArray);
    this.global.httpCenter.deleteAdminArea(areaID).subscribe({
      next: (response) => {
        console.log('Deleted successfully:', response);
        this.getAreas();
      },
      error: (error) => {
        if (error.status === 0) {
          this.global.openDialog("Error inesperado al conectar con el servidor.");
        }
        else
          this.global.openDialog(error.error.errors[0].reason);
      }
    });
  }

  /**
   * This function finds the ID of a specific item based on its name within an array.
   * It iterates through the array to find the item with a matching name and returns its ID.
   * If no match is found, it returns -1.
   * @param name The name of the item to find.
   * @param array The array of items to search within.
   * @returns The ID of the item if found, otherwise -1.
   */
  findId(name: string, array: any[]): number {
    return array.find(item => item.name === name)?.id;
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
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
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

  /**
   * This function is used to handle errors.
   * It checks the error status and displays a corresponding message to the user.
   * If the error status is 'Unknown Error', it prompts the user to try again.
   * If the error has a specific reason, it displays that reason.
   * If the error is unexpected, it displays a generic error message.
   * @param error The error object to be handled.
   */
  handleError(error: any) {
    if (error.statusText === 'Unknown Error') {
      this.global.openDialog("Falló la conexión. Intente de nuevo");
    } else if (error.error) {
      this.global.openDialog(error.error.errors[0].reason);
    } else {
      this.global.openDialog('No se ha podido guardar correctamente. Error inesperado');
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
