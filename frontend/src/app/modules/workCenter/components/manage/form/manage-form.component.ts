import { policyRoutes } from './../../../../policy/policy.routing';
import { Component, OnDestroy, OnInit, Renderer2, signal } from '@angular/core';
import * as L from 'leaflet';
import { Modal } from 'bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { AdminArea, InstallationType, WorkCenterData, Location, Formula, Variable, LocationEdited, ManagementTeam, FormulaInfo, TeamMember } from '../../../../../models/workCenter.interface';
import { Subscription } from 'rxjs';
import { MAP_URL } from '../../../../../config/api.config';
import { Item } from '../../../../../shared/shared.module';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { MathValidatorDirective } from '../../../../../directives/mathValidation/math-validator.directive';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { UserService } from '../../../../../services/user/user.service';

@Component({
  selector: 'app-center-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  private map!: L.Map;
  private marker!: L.Marker;
  private modal!: Modal;
  data: any;
  form: FormGroup;
  centerWorkers: Item[] = [];
  policies: Item[] = [];
  typeArray: Item[] = [];
  enableAddType: boolean = false;
  areaArray: Item[] = [];
  enableAddArea: boolean = false;
  postMethod: boolean = true;
  locationConfirm: boolean = true;
  loading: boolean = false;
  formulaVariables: Item[] = [
    { id: 0, name: 'consumo' },
    { id: 1, name: 'por_ciento_extra' },
    { id: 2, name: 'aumento' }
  ];
  variablesValues: Map<string, string> = new Map<string, string>([
    ["por_ciento_extra", "15"],
    ["aumento","20"]
  ]);
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
    private renderer: Renderer2,
    private snackbar: SnackbarService,
    private httpPolicy: PolicyService,
    private httpUser: UserService
  )
  {
    this.form = this.fb.group({
      name: ['', Validators.required],
      adminAreaName: ['', Validators.required],
      instalationType: ['', Validators.required],
      policy: null,
      monthlyConsumptionLimit: [null, Validators.required],
      formula: ['', Validators.required],
      teamWork: null,
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      location: ['', Validators.required],
      applyingDate: null
    });
    this.dataService.setData(null);

    this.form.get('instalationType')!.valueChanges.subscribe(() => {
      if (String(this.global.getControlValue(this.form, 'instalationType')).trim() == '') {
        this.enableAddType = false;
        return;
      }

      const type = this.global.getControlValue(this.form, 'instalationType');
      if (type)
        this.enableAddType = !type.id;
    });

    this.form.get('adminAreaName')!.valueChanges.subscribe(() => {
      if (String(this.global.getControlValue(this.form, 'adminAreaName')).trim() == '') {
        this.enableAddArea = false;
        return;
      }

      const area = this.global.getControlValue(this.form, 'adminAreaName');
      if (area)
        this.enableAddArea = !area.id;
    });
  }

  ngOnInit() {
    const sub = this.dataService.currentData.subscribe(newData => {
      if (newData) {
        this.data = newData[0];
        this.postMethod = newData[1];
        this.form.patchValue(this.data);

        if (this.data) {
          if (this.data.policy) {
            const dateString = this.data.policy.applyingDate;
            const dateObject = new Date(dateString);
            this.global.getControl(this.form, 'applyingDate').setValue(dateObject);
            const policyApplied: Item = {
              id: this.data.policy.efficiencyPolicy.policyId,
              name: this.data.policy.efficiencyPolicy.policyName
            };
            this.global.getControl(this.form, 'policy').setValue(policyApplied);
          }

          const costFormula = this.data.costFormula;
          if (costFormula) {
            this.global.getControl(this.form, 'formula').setValue(costFormula.expression);
            const tokens = costFormula.expression.split(" ");
            const array: Item[] = [];
            for (let i = 0; i < tokens.length; i++) {
              array.push({
                id: i + 1,
                name: tokens[i]
              });
            }
            this.options.update(options => options = array);

            for (const variable of costFormula.variables) {
              this.variablesValues.set(variable.variableName, variable.expression);
            }

            this.assignValues();
          }

          const areaId = this.data.adminArea.id;
          const area: Item = {
            id: areaId,
            name: this.data.adminAreaName
          };
          const instalTypeId = this.data.instalType.id;
          const instalType: Item = {
            id: instalTypeId,
            name: this.data.instalationType
          };
          const location = this.data.location.addressDetails;
          const latitude = this.data.location.coordenateDTO.latitude;
          const longitude = this.data.location.coordenateDTO.longitude;

          this.getWorkers();

          this.global.getControl(this.form, 'adminAreaName').setValue(area);
          this.global.getControl(this.form, 'instalationType').setValue(instalType);
          this.global.getControl(this.form, 'location').setValue(location);
          this.global.getControl(this.form, 'latitude').setValue(latitude);
          this.global.getControl(this.form, 'longitude').setValue(longitude);
        }

        this.loading = newData[2];
      }
    });

    this.subscriptions.add(sub);
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Modal and form Region

  /**
   * Handles the form submission process.
   * This method checks the form validity, prompts the user for confirmation, and initiates the creation or editing process.
   */
  onSubmit(): void {
    this.loading = true;
    if (this.form.invalid) {
      this.global.openDialog('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      this.loading = false;
      return;
    }

    const policy = this.global.getControlValue(this.form, 'policy');
    let options = [
      this.global.getControlValue(this.form, 'adminAreaName').id,
      this.global.getControlValue(this.form, 'instalationType').id
    ];
    let response = ['Nombre de Área', 'Tipo de Instalación'];
    if (policy) {
      options.push(policy.id);
      response.push('Nombre de Política');
    }

    const valid = this.global.allValid(options, response);

    if(valid[1] == 'Nombre de Política' && this.global.getControlValue(this.form, 'policy') === "")
      valid[0] = true;

    if (valid[0]) {
      this.global.openDialog('¿Está seguro de que desea guardar los cambios?', true).subscribe(
      result => {
        if (result) {
          this.saveData();
        } else {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.global.openDialog(`Por favor, selecciona un ${valid[1]} válido.`);
    }
  }

  /**
   * Resets the form and clears all form fields when the modal is closed.
   */
  onCloseModal(): void {
    this.form.reset();
    this.clearForm();
    this.form.patchValue({
      name: '',
      adminAreaName: '',
      instalationType: '',
      policy: null,
      monthlyConsumptionLimit: null,
      formula: '',
      teamWork: null,
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

    this.variablesValues = new Map<string, string>([
      ["por_ciento_extra", "15"],
      ["aumento","20"]
    ]);
    this.updateFormula();
  }

  /**
   * Opens a modal to display a map for selecting a location.
   * Initializes the map if it hasn't been created yet and sets up a click event
   * to place a marker on the map at the clicked location.
   */
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
        this.map = L.map('map').setView([22, -80], 7);
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


  /**
   * Clears the form by removing controls that are not part of `myControls`.
   * Also removes all elements with the class 'row mb-3' from the DOM.
   */
  clearForm(): void {
    Object.keys(this.form.controls).forEach(controlName => {
      if (!this.myControls.includes(controlName)) {
        this.form.removeControl(controlName);
      }
    });

    const formContainer = document.getElementsByClassName('row mb-3');
    if (formContainer) {
      Array.from(formContainer).forEach((element: Element) => {
        element.remove();
      });
    }
  }

  /**
   * Assigns values to the form by creating controls for each valid option.
   * Clears the form, iterates over the options, and dynamically creates form controls
   * for each option that is not a formula symbol, not named 'consumo', and not already used.
   * The controls are added to the form and corresponding input elements are created in the DOM.
   */
  assignValues(): void {
    this.clearForm();

    let i = 0;
    let row: HTMLDivElement | null = null;
    let usedOptions: string[] = [];

    for (const option of this.options()) {
      if (this.formulaSymbols.every(symbol => symbol.id != option.id && symbol.name != option.name)
        && option.name != 'consumo' && !usedOptions.includes(option.name)) {

        const control = this.fb.control('', Validators.required);
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

          this.renderer.setAttribute(input, 'type', 'text');
          this.renderer.setAttribute(input, 'class', 'form-control');
          this.renderer.setAttribute(input, 'id', option.name);

          const mathValidator = new MathValidatorDirective(this.renderer, input);
          this.renderer.listen(input, 'input', mathValidator.onInputChange.bind(mathValidator));
          this.renderer.listen(input, 'keypress', mathValidator.onKeyPress.bind(mathValidator));
          this.renderer.listen(input, 'blur', (event) => {
            const value = event.target.value;
            control.setValue(value);
            if (value != "")
              this.variablesValues.set(option.name, value);
            this.updateInputClass(input, control);
          });

          if (!this.variablesValues.has(option.name)) {
            this.variablesValues.set(option.name, "");
          }

          const value = this.variablesValues.get(option.name)!;
          control.setValue(value);
          this.renderer.setProperty(input, 'value', control.value);

          const errorDiv = this.renderer.createElement('div');
          errorDiv.className = "invalid-feedback"
          this.renderer.listen(input, 'blur', () => {
            const control = this.form.get(option.name);
            if (control) {
              errorDiv.innerHTML = '';
              if (control.invalid) {
                errorDiv.innerHTML = 'Este campo es obligatorio';
                errorDiv.style.display = 'block';
              }
            }
          });

          this.renderer.setAttribute(input, 'appMathValidator', '');

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

    for (const variable of this.variablesValues.keys()) {
      if (!usedOptions.includes(variable)) {
        if (variable === "por_ciento_extra")
          this.variablesValues.set("por_ciento_extra", "15");
        else if (variable === "aumento")
          this.variablesValues.set("aumento", "20");
        else
          this.variablesValues.delete(variable);
      }
    }
  }

  /**
   * Activates the close button by simulating a click event.
   * This function finds the button with the ID 'close-button' and triggers a click event on it.
   */
  activateCloseButton(): void {
    const closeButton = document.getElementById('close-button') as HTMLButtonElement;
    closeButton.click();
  }

  // Validation Region

  /**
   * Checks whether the applying date field must be disabled or not.
   * It must be disabled if the user haven't changed the current policy of
   * the center
   *
   * @returns True if the applying date must be disabled, otherwise false.
   */
  checkApplyingDateDesabled(): boolean {
    if (this.data && this.data.policy) {
      const policy = this.global.getControlValue(this.form, 'policy');
      if (policy && policy.id) {
        console.log(this.data.policy.efficiencyPolicy.policyId == policy.id)
        return this.data.policy.efficiencyPolicy.policyId == policy.id;
      }
    }

    return false;
  }

  /**
   * Marks all form controls as touched to trigger validation.
   */
  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.global.getControl(this.form, field);
      control?.markAsTouched();
    });
  }

  /**
   * Validates if the given option is a valid formula element.
   * An option is considered invalid if it starts with a number or contains any special symbols.
   * @param option - The option string to be validated.
   * @returns A boolean indicating whether the option is valid.
   */
  validateFormulaOption(option: string): boolean {
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const symbols = [
      '`', '~', '%', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
      '-', '+', '=', '{', '}', '[', ']', '|', '\\', ':', ';',
      '"', '\'', '<', '>', ',', '.', '?', '/'
    ];

    const array = option.split(" ");

    if (
      numbers.includes(option[0]) ||
      symbols.find(symbol => option.includes(symbol)) != undefined ||
      array.length > 1
    ) {
      return false;
    }

    return true;
  }

  // Utils Region

  /**
   * Filters dates to determine if they are in the past.
   *
   * @param d - The date to be checked.
   * @returns True if the date is before today, otherwise false.
   */
  filterDate = (d: Date | null): boolean => {
    const today = new Date();
    const Tday = today.getDate();
    const Tmonth = today.getMonth();
    const Tyear = today.getFullYear();

    const day = d?.getDate();
    const month = d?.getMonth();
    const year = d?.getFullYear();

    let appDateDay = 0;
    let appDateMonth = 0;
    let appDateYear = 0;

    if (this.data) {
      const policy = this.data.policy;
      let applyingDate = today;

      if (policy)
        applyingDate = new Date(policy.applyingDate);

      appDateDay = applyingDate.getDate();
      appDateMonth = applyingDate.getMonth();
      appDateYear = applyingDate.getFullYear();
    }

    if (year != undefined && month != undefined && day != undefined && d != undefined &&
      (year < Tyear || (year === Tyear && (month < Tmonth) || (year === Tyear && month === Tmonth && day <= Tday)))
    ) {
      if (this.data && (year > appDateYear || (year === appDateYear && (month > appDateMonth) ||
      (year === appDateYear && month === appDateMonth && day >= appDateDay))))
      {
        return true;
      }

      return true;
    }

    return false;
  };

  /**
   * Adds elements to the formula by joining the names of the options.
   * Updates the form with the constructed formula and assigns values.
   */
  updateFormula(value: Item = [][0], validate: boolean = true): void {
    if (validate) {
      const names = this.options().map(option => option.name);
      this.form.patchValue({
        formula: names.join(' ')
      });
      this.assignValues();
    } else {
      this.global.openDialog("La variable no puede empezar con un número y solo puede contener letras, dígitos y '_'.");
    }
  }

  /**
   * Adds a symbol to the formula. If the symbol is 'C', it clears the current options.
   * Otherwise, it appends the symbol to the existing options and updates the formula.
   * @param option - The symbol to be added to the formula.
   */
  addSymbolFormula(option: Item): void {
    if (option.name === 'C') {
      this.options = signal([]);
      this.updateFormula();
      return;
    }

    this.options = signal([...this.options(), option]);
    this.updateFormula();
  }

  /**
   * Updates the CSS class of the input element based on the validity of the form control.
   * If the control is invalid, it adds the 'is-invalid' class to the input element.
   * Otherwise, it removes the 'is-invalid' class from the input element.
   *
   * @param input - The input element to update.
   * @param control - The form control to check for validity.
   */
  updateInputClass(input: any, control: FormControl): void {
    if (control.invalid) {
      this.renderer.addClass(input, 'is-invalid');
    } else {
      this.renderer.removeClass(input, 'is-invalid');
    }
  }

  /**
   * Generates a new location instance for save it in the server
   * @returns a new `Location` or `LocationEdited` instance according to
   * creation or edition mode.
   */
  generateLocationInstance(): Location | LocationEdited {
    const addressDetails = this.global.getControlValue(this.form, 'location');
    const latitude = this.global.getControlValue(this.form, 'latitude');
    const longitude = this.global.getControlValue(this.form, 'longitude');

    if (this.postMethod) {
      return {
        addressDetails: addressDetails,
        coordenate: {
          latitude: latitude,
          longitude: longitude
        }
      }
    }

    return {
      addressDetails: addressDetails,
      latitude: latitude,
      longitude: longitude
    }
  }

  /**
   * Generates a new work center instance for save it in the server
   * @param locationID The id of the location associated with the center
   * @param teamID The id of the team associated with the center
   * @returns a `WorkCenterData` instance to be posted or put
   */
  generateCenterInstance(locationID: number, teamID: number): WorkCenterData {
    const policy = this.global.getControlValue(this.form, 'policy');
    let policyId = 0;
    let applyingDate = null;
    if (policy) {
      policyId = policy.id;
      applyingDate = this.global.getControlValue(this.form, 'applyingDate');
    }

    return {
      name: this.global.getControlValue(this.form, 'name'),
      areaId: this.global.getControlValue(this.form, 'adminAreaName').id,
      installationTypeId: this.global.getControlValue(this.form, 'instalationType').id,
      locationId: locationID,
      managementTeamId: teamID,
      efficiencyPolicyId: policyId,
      policyApplyingDate: applyingDate,
      consumptionLimit: this.global.getControlValue(this.form, 'monthlyConsumptionLimit')
    };
  }

  /**
   * Generates a new formula instance for save it in the server
   * @param centerID The id of the center associated with the formula
   * @returns a new `Formula` or `FormulaInfo` instance according to
   * creation or edition mode.
   */
  generateFormulaInstance(centerID: number): Formula | FormulaInfo {
    let variables: Variable[] = [];

    for (const variable of this.variablesValues) {
      variables.push({
        variableName: variable[0],
        expression: variable[1]
      });
    }

    if (this.postMethod) {
      return {
        companyId: centerID,
        name: `${centerID}`,
        expression: this.global.getControlValue(this.form, 'formula'),
        variables: variables
      };
    }

    return {
      formulaId: this.data.costFormula.id,
      companyId: centerID,
      name: `${centerID}`,
      expression: this.global.getControlValue(this.form, 'formula'),
      variables: variables
    };
  }

  /**
   * Generates a new management team for save it in the server
   * @returns a new `ManagementTeam` instance to be posted and put
   */
  generateTeamInstance(): ManagementTeam {
    const teamWork = this.global.getControlValue(this.form, 'teamWork');
    return {
      name: `${this.data.id}`,
      userIds: teamWork.map((user: Item) => user.id)
    }
  }

  // Fetch Region

  /**
   * Fetches the list of workers associated with the current company.
   * This method sends an HTTP request to retrieve the list of workers for the company identified by the current data's ID.
   * Upon receiving the response, it maps the worker data to an array of objects containing worker IDs and usernames.
   */
  getWorkers(): void {
    this.httpUser.getUserByCompany(this.data.id).subscribe(workers => {
      this.centerWorkers = workers.map(worker => ({
        id: worker.id,
        name: worker.username
      }));

      const team = this.data.team;
      if (team) {
        const members: Item[] = this.centerWorkers.filter(worker =>
          team.members.find((member: TeamMember) => member.userId == worker.id && member.userName == worker.name)
        );
        this.global.getControl(this.form, 'teamWork').setValue(members);
      }
    });
  }

  /**
   * Fetches the necessary data for the form.
   * This method updates the formula and retrieves areas, types, and policies.
   */
  fetchData(): void {
    this.updateFormula();
    this.getAreas();
    this.getTypes();
    this.getPolicies();
  }

  /**
   * Retrieves the list of policies.
   * This function fetches the list of policies from the server and updates the component's state.
   * It populates the `policies` array with the fetched policies.
   */
  getPolicies(): void {
    this.httpPolicy.getPolicies().subscribe(policies => {
      this.policies = policies.map(policy => {
        return {
          id: policy.policyId,
          name: policy.policyName
        }
      });
    });
  }

  /**
   * Confirms the selected location by retrieving the marker's position.
   * If a marker is present, it updates the location confirmation status
   * and fetches the address from the coordinates.
   */
  async confirmLocation() {
    if (this.marker) {
      this.locationConfirm = false;
      const position = this.marker.getLatLng();
      this.getAddressFromCoordinates(position.lat, position.lng);
    }
  }

  /**
   * Fetches the address from the given latitude and longitude coordinates.
   * Updates the form with the latitude, longitude, and location name.
   * @param lat - The latitude of the location.
   * @param lng - The longitude of the location.
   */
  async getAddressFromCoordinates(lat: number, lng: number): Promise<void> {
    const response: any = await fetch(`${MAP_URL}&lat=${lat}&lon=${lng}`);
    const data: any = await response.json();
    this.form.patchValue({
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
      location: data.display_name
    });
    this.modal.hide();
  }

  /**
   * Retrieves the list of installation types.
   * This function fetches the list of installation types from the server and updates the component's state.
   * It populates the `typeObjectArray` with the fetched types and `typeStringArray` with their names.
   */
  getTypes(): void {
    this.global.httpCenter.getInstallationType().subscribe(types => {
      this.typeArray = types.map(type => {
        return {
          id: type.id,
          name: type.name
        }
      });
    });
  }

  /**
   * Retrieves the list of administrative areas.
   * This function fetches the list of administrative areas from the server and updates the component's state.
   * It populates the `areaObjectArray` with the fetched areas and `areaStringArray` with their names.
   */
  getAreas(): void {
    this.global.httpCenter.getAdminAreas().subscribe(areas => {
      this.areaArray = areas.map(area => {
        return {
          id: area.id,
          name: area.name
        }
      });
    });
  }

  // POST and PUT Region

  /**
   * Adds a new installation type.
   * This function is used to create a new installation type and post it to the server.
   * It disables the add type button, creates a new InstallationType object, and posts it to the server.
   * If successful, it retrieves the updated list of types.
   */
  addType(): void {
    this.enableAddType = false;
    const instType: InstallationType = {
      name: this.global.getControlValue(this.form, 'instalationType'),
      description: null
    };

    this.global.httpCenter.postInstallationType(instType).subscribe({
      next: (response) => {
        this.snackbar.openSnackBar('Añadido exitosamente...');
        console.log('Created successfully:', response);
        this.getTypes();
        this.global.getControl(this.form, 'instalationType').setValue(
          {
            id: response.id,
            name: response.name
          }
        );
      },
      error: (error) => {
        this.enableAddType = true;
        console.log(error);
        this.snackbar.openSnackBar('Error al añadir, intente de nuevo...');
      }
    });
  }

  /**
   * Adds a new administrative area.
   * This function is used to create a new administrative area in the system.
   * It disables the 'Add Area' button, constructs an `AdminArea` object with the name from the form control 'adminAreaName',
   * and posts the creation request to the server. If successful, it retrieves the updated list of areas.
   */
  addArea(): void {
    this.enableAddArea = false;
    const area: AdminArea = {
      name: this.global.getControlValue(this.form, 'adminAreaName'),
      description: null
    };

    this.global.httpCenter.postAdminArea(area).subscribe({
      next: (response) => {
        console.log('Created successfully:', response);
        this.snackbar.openSnackBar('Añadido exitosamente...');
        this.getAreas();
        this.global.getControl(this.form, 'adminAreaName').setValue(
          {
            id: response.id,
            name: response.name
          }
        );
      },
      error: (error) => {
        this.enableAddArea = true;
        console.log(error);
        this.snackbar.openSnackBar('Error al añadir, intente de nuevo...');
      }
    });
  }

  /**
   * Creates a new work center or edits an existing one.
   * This function is responsible for sending the necessary data to the server to create or edit a work center.
   */
  saveData(): void {
    this.createOrEditLocation();
  }

  /**
   * Sends a request to create or edit a location.
   * It creates or edits a location and then it creates or edits
   * a work center (or a team if the user selects any available member)
   */
  createOrEditLocation(): void {
    const location = this.generateLocationInstance();
    if (this.postMethod) {
      this.global.httpCenter.postLocation(location as Location).subscribe({
        next: (response) => {
          console.log("Location created successfully", response);
          this.createOrEditCenter(response.id);
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        }
      });
    } else {
      this.global.httpCenter.editLocation(location as LocationEdited, this.data.location.id).subscribe({
        next: (response) => {
          console.log("Location edited successfully", response);
          const teamWork = this.global.getControlValue(this.form, 'teamWork');
          if (teamWork && teamWork.length) {
            this.createOrEditTeam(response.id);
          } else {
            this.createOrEditCenter(response.id);
          }
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        }
      });
    }
  }

  /**
   * Sends a request to create or edit a work center instance.
   * @param locationID - The id of the location associated to the center.
   * @param teamID - The id of the management team associated to the center.
   */
  createOrEditCenter(locationID: number, teamID: number = 0): void {
    const center = this.generateCenterInstance(locationID, teamID);
    if (this.postMethod) {
      this.global.httpCenter.postCenter(center).subscribe({
        next: (response) => {
          console.log("Center created succesfully", response);
          this.createOrEditFormula(response.id);
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        }
      })
    } else {
      this.global.httpCenter.editCenter(center, this.data.id).subscribe({
        next: (response) => {
          console.log("Center edited succesfully", response);
          this.createOrEditFormula(response.id);
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        }
      })
    }
  }

  /**
   * Sends a request to create or edit a formula.
   * @param centerID - The id of the center associated to the formula.
   */
  createOrEditFormula(centerID: number): void {
    const formula = this.generateFormulaInstance(centerID);
    if (this.postMethod) {
      this.global.httpCenter.postFormula(formula as Formula).subscribe({
        next: (response) => {
          console.log("Formula created successfully", response);
          this.snackbar.openSnackBar("Añadido exitosamente...");
          this.dataService.notifyDataUpdated();
          this.activateCloseButton();
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        }
      });
    } else {
      const formula = this.generateFormulaInstance(centerID);
      this.global.httpCenter.editFormula(formula as FormulaInfo).subscribe({
        next: (response) => {
          console.log("Formula edited successfully", response);
          this.deleteTeam();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  /**
   * Creates or edits a management team for a work center.
   * Sends a request to create or edit a management team and associates it with a work center.
   * @param locationID - The ID of the location to associate with the team.
   */
  createOrEditTeam(locationID: number): void {
    const team = this.generateTeamInstance();
    if (!this.data.team) {
      this.global.httpCenter.postManagementTeam(team, this.data.id).subscribe({
        next: (response) => {
          console.log("Team created successfully", response);
          this.createOrEditCenter(locationID, response.id);
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        }
      });
    } else {
      this.global.httpCenter.editManagementTeam(team, this.data.id, this.data.team.id).subscribe({
        next: (response) => {
          console.log("Team edited successfully", response);
          this.createOrEditCenter(locationID, response.id);
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        }
      });
    }
  }

  // DELETE Region

  /**
   * Deletes an installation type.
   * This function is used to remove an installation type from the system.
   * It finds the ID of the type to be deleted, posts the deletion request to the server,
   * and if successful, retrieves the updated list of types.
   * @param type The name of the installation type to be deleted.
   */
  deleteType(type: Item): void {
    const instalType = this.global.getControlValue(this.form, 'instalationType');
    if (instalType && instalType.id == type.id)
      this.global.getControl(this.form, 'instalationType').setValue("");

    this.global.httpCenter.deleteInstallationType(type.id).subscribe({
      next: (response) => {
        console.log('Deleted successfully:', response);
        this.snackbar.openSnackBar('Eliminado exitosamente...');
        this.getTypes();
      },
      error: (error) => {
        console.log(error);
        this.snackbar.openSnackBar('Error al eliminar, intente de nuevo...');
      }
    });
  }

  /**
   * Deletes an administrative area.
   * This function is used to remove an administrative area from the system.
   * It finds the ID of the area to be deleted, posts the deletion request to the server,
   * and if successful, retrieves the updated list of areas.
   * @param area The name of the area to be deleted.
   */
  deleteArea(area: Item): void {
    const adminArea = this.global.getControlValue(this.form, 'adminAreaName');
    if (adminArea && adminArea.id == area.id)
      this.global.getControl(this.form, 'adminAreaName').setValue("");

    this.global.httpCenter.deleteAdminArea(area.id).subscribe({
      next: (response) => {
        console.log('Deleted successfully:', response);
        this.snackbar.openSnackBar('Eliminado exitosamente...');
        this.getAreas();
      },
      error: (error) => {
        console.log(error);
        this.snackbar.openSnackBar('Error al eliminar, intente de nuevo...');
      }
    });
  }

  /**
   * Deletes a management team.
   * This function is used to remove a management team when an user removes all members
   * of the current team of the center
   */
  deleteTeam(): void {
    const teamWork = this.global.getControlValue(this.form, 'teamWork');
    if (teamWork && !teamWork.length && this.data.team.id) {
      this.global.httpCenter.deleteManagementTeam(this.data.id, this.data.team.id).subscribe({
        next: (response) => {
          console.log('Team Deleted successfully:', response);
          this.snackbar.openSnackBar("Editado exitosamente...");
          this.dataService.notifyDataUpdated();
          this.activateCloseButton();
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.snackbar.openSnackBar("Editado exitosamente...");
      this.dataService.notifyDataUpdated();
      this.activateCloseButton();
    }
  }
}
