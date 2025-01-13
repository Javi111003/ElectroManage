import { Component } from '@angular/core';
import * as L from 'leaflet';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { WorkCenterService } from '../../../../../services/workCenter/work-center.service';

@Component({
  selector: 'app-location-index',
  templateUrl: './location-index.component.html',
  styleUrl: './location-index.component.css'
})
export class LocationComponent {
  /**
   * Constructor that initializes the required services and form
   * @param global Global module service for shared functionalities
   * @param fb Form builder service for creating reactive forms
   * @param http Work center service for API communications
   */
  constructor (
    public global: GlobalModule,
    private fb: FormBuilder,
    private http: WorkCenterService
  ) {
    this.form = this.fb.group({
      workCenter: ''
    });
  }

  /** Array to store the work centers location data */
  centerLocationData: any[] = [];

  /** Form group for handling user inputs */
  form: FormGroup;

  /** Leaflet map instance */
  map!: L.Map;

  /**
   * Lifecycle hook that initializes the component
   * Sets up the map and loads necessary data
   */
  ngOnInit(): void {
    this.inicializarMapa();
    this.global.Reset();
    this.global.getWorkCenters();
    this.getCenterDetailsList();
  }

  /**
   * Retrieves the list of work centers details from the server
   * and stores them in centerLocationData
   */
  getCenterDetailsList():void{
    this.http.getCenterDetailsList().subscribe(centers => {
      centers.map((center: any) => {
        this.centerLocationData.push(center);
      });
    });
  }

  /**
   * Gets a form control by its name
   * @param control Name of the control to retrieve
   * @returns FormControl instance
   */
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  /**
   * Gets the value of a form control
   * @param control Name of the control to get value from
   * @returns The value of the specified control
   */
  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  /**
   * Initializes the Leaflet map with default settings
   * Centers the map view on Cuba
   */
  inicializarMapa(): void {
    this.map = L.map('map').setView([22, -80], 7); // Vista inicial del mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);
  }

  /**
   * Selects and displays a work center on the map
   * @param nombre Name of the work center to display
   * Shows a popup with the work center's details
   */
  seleccionarEmpresa(id: number): void {
    const empresa = this.centerLocationData.find(e => e.id === id);
    if (empresa) {
      this.map.setView([empresa.location.coordenateDTO.latitude, empresa.location.coordenateDTO.longitude], 16); // Centra el mapa en la ubicación de la empresa
      L.popup()
        .setLatLng([empresa.location.coordenateDTO.latitude, empresa.location.coordenateDTO.longitude])
        .setContent(`
          <h3>${empresa.name}</h3>
          <p><b>Dirección:</b> ${empresa.location.addressDetails}</p>
          <p><b>Descripción</b>:Esta empresa pertenece al área administrativa <b>${empresa.administrativeArea.name}</b> y su tipo de instalación es <b>${empresa.installationType.name}</b></p>
        `)
        .openOn(this.map);
    }
  }

  /**
   * Handles the click event for selecting a work center
   * Validates the selection and displays the location on the map
   */
  onClick() {
    if (this.getControlValue('workCenter').name) {
      this.seleccionarEmpresa(this.getControlValue('workCenter').id);
    } else {
      this.global.openDialog('Por favor, selecciona un Centro de Trabajo');
    }
  }
}
