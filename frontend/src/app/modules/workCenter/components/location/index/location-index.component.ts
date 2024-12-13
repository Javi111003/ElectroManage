import { Component } from '@angular/core';
import * as L from 'leaflet';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
interface Empresa {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  informacion: string;
}


@Component({
  selector: 'app-location-index',
  templateUrl: './location-index.component.html',
  styleUrl: './location-index.component.css'
})
export class LocationComponent {
  constructor (
    public global: GlobalModule,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      startDate: [null],
      endDate: [null],
      workCenter: ''
    });
  }
  form: FormGroup;
  map!: L.Map;
  empresas: Empresa[] = [
    {
      id: 1,
      nombre: 'Dickinson - Huel',
      direccion: 'Dirección: por Manzanillo puripalla',
      latitud: 40.73061,
      longitud: -73.935242,
      informacion: 'Son buena gente'
    },
    {
      id: 2,
      nombre: 'Barrows and Sons',
      direccion: 'Dirección:Izquierda , Derecha, Izquierda',
      latitud: 34.052235,
      longitud: -118.243683,
      informacion: 'Son Mr.Barrow y sus hijos que te puedo decir'
    }
    // Agrega más empresas aquí
  ];
  ngOnInit(): void {
    this.inicializarMapa();
    this.global.Reset();
    this.global.getWorkCenters();
  }
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }
  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }
  inicializarMapa(): void {
    this.map = L.map('map').setView([20, 0], 2); // Vista inicial del mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);
  }
   // Este método será llamado cuando el nombre de la empresa se seleccione
   seleccionarEmpresa(nombre: string): void {
    const empresa = this.empresas.find(e => e.nombre === nombre);
    if (empresa) {
      this.map.setView([empresa.latitud, empresa.longitud], 15); // Centra el mapa en la ubicación de la empresa
      const popup = L.popup()
        .setLatLng([empresa.latitud, empresa.longitud])
        .setContent(`
          <h3>${empresa.nombre}</h3>
          <p><b>Dirección:</b> ${empresa.direccion}</p>
          <p>${empresa.informacion}</p>
        `)
        .openOn(this.map);
    }
  }
  onClick() {
      console.log(this.getControlValue('workCenter'))
      if (this.global.isOptionValid(this.global.centerStringArray, this.getControlValue('workCenter'))) {
        this.seleccionarEmpresa(this.getControlValue('workCenter'));
      } else {
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo');
      }
  }
}
