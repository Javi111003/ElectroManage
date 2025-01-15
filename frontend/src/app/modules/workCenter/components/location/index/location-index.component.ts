import { Component } from '@angular/core';
import * as L from 'leaflet';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { WorkCenterService } from '../../../../../services/workCenter/work-center.service';
import { LOCATION_URL } from '../../../../../config/api.config';

@Component({
  selector: 'app-location-index',
  templateUrl: './location-index.component.html',
  styleUrl: './location-index.component.css'
})
export class LocationComponent {
  constructor (
    public global: GlobalModule,
    private fb: FormBuilder,
    private http: WorkCenterService
  ) {
    this.form = this.fb.group({
      workCenter: ''
    });
  }

  centerLocationData: any[] = [];
  form: FormGroup;
  map!: L.Map;

  ngOnInit(): void {
    this.MapInit();
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
  MapInit(): void {
    this.map = L.map('map').setView([22, -80], 7);
    L.tileLayer(LOCATION_URL, {
      maxZoom: 19
    }).addTo(this.map);
  }


  showCenterLocation(id: number): void {
    const center = this.centerLocationData.find(center => center.id === id);
    if (center) {
      this.map.setView([center.location.coordenateDTO.latitude, center.location.coordenateDTO.longitude], 16);
      L.popup()
        .setLatLng([center.location.coordenateDTO.latitude, center.location.coordenateDTO.longitude])
        .setContent(`
          <h3>${center.name}</h3>
          <p><b>Dirección:</b> ${center.location.addressDetails}</p>
          <p><b>Descripción</b>:Esta empresa pertenece al área administrativa
          <b>${center.administrativeArea.name}</b> y su tipo de instalación es
          <b>${center.installationType.name}</b></p>
        `).openOn(this.map);
    }
  }

  /**
   * Handles the click event for selecting a work center
   * Validates the selection and displays the location on the map
   */
  onLocateClick() {
    if (this.getControlValue('workCenter').name) {
      this.showCenterLocation(this.getControlValue('workCenter').id);
    } else {
      this.global.openDialog('Por favor, selecciona un Centro de Trabajo');
    }
  }
}
