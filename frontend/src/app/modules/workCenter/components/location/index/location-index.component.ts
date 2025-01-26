import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class LocationComponent implements OnInit, AfterViewInit {
  centerLocationData: any[] = [];
  form: FormGroup;
  map!: L.Map;

  constructor (
    public global: GlobalModule,
    private fb: FormBuilder,
    private http: WorkCenterService
  ) {
    this.form = this.fb.group({
      workCenter: ''
    });
  }

  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
    this.getCenterDetailsList();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mapInit();
    }, 100);
  }

  /**
   * Retrieves the list of work centers details from the server
   * and stores them in centerLocationData
   */
  getCenterDetailsList():void{
    this.http.getCenterDetailsList().subscribe(centers => {
      this.centerLocationData = centers;
    });
  }

  /**
   * Initializes the Leaflet map with default settings
   * Centers the map view on Cuba
   */
  mapInit(): void {
    this.map = L.map('map').setView([22, -80], 7);
    L.tileLayer(LOCATION_URL, {
      maxZoom: 19
    }).addTo(this.map);
    this.map.invalidateSize();
  }

  /**
   * Displays the location of the center with the specified ID on the map.
   *
   * This function searches for the center with the given ID in the `centerLocationData` array.
   * If a center is found, it sets the map view to the center's coordinates at zoom level 16
   * and opens a popup with the center's details.
   *
   * @param id - The ID of the center to display.
   * @void
   */
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
    if (this.global.getControlValue(this.form, 'workCenter').name) {
      this.showCenterLocation(this.global.getControlValue(this.form, 'workCenter').id);
    } else {
      this.global.openDialog('Por favor, selecciona un Centro de Trabajo');
    }
  }
}
