import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigColumn } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {
  form: FormGroup;
  showTable = false;
  isSecondSelectDisabled = true; // Inicialmente inactivo
  options = [
    { value: 'centro1', label: 'Centro 1' },
    { value: 'centro2', label: 'Centro 2' },
    { value: 'centro3', label: 'Centro 3' },
  ];
  // Mapeo de oficinas por centro
  oficinasPorCentro = {
    centro1: [
      { value: 'oficina1', label: 'Oficina 1.1' },
      { value: 'oficina2', label: 'Oficina 1.2' },
    ],
    centro2: [
      { value: 'oficina3', label: 'Oficina 2.1' },
      { value: 'oficina4', label: 'Oficina 2.2' },
    ],
    centro3: [
      { value: 'oficina5', label: 'Oficina 3.1' },
      { value: 'oficina6', label: 'Oficina 3.2' },
    ],
  };
  // Opciones dinámicas de oficinas
  optionsOficina: { value: string; label: string; }[] = [];
  // Datos de ejemplo para la tabla
  dataSource: any[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];

  // Definición de las columnas a mostrar en la tabla
  displayedColumns: ConfigColumn[] = [
    {
      title: 'No.',
      field: 'position'
    },
    {
      title: 'Name',
      field: 'name'
    },
    {
      title: 'Symbol',
      field: 'symbol'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstSelect: [''], // Control para el primer selector
      secondSelect: [{ value: '', disabled: true }] // Control para el segundo selector inicialmente deshabilitado
    });
  }

  ngOnInit() {
    this.form.get('firstSelect')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('secondSelect')?.enable();
      } else {
        this.form.get('secondSelect')?.disable();
      }
    });
  }

  // Función que se llama cuando cambia la selección en los selectores
  onSelectionChange() {
    const { firstSelect, secondSelect } = this.form.value;
    // Mostrar la tabla solo si ambos selectores tienen valores seleccionados
    this.showTable = firstSelect && secondSelect;
  }
  onCentroChange(event: any) {
    const selectedCentro: keyof typeof this.oficinasPorCentro = event.value;

    // Reinicia el select de oficina
    this.form.get('secondSelect')?.reset();

    // Actualiza las opciones de oficina según el centro seleccionado
    this.optionsOficina = this.oficinasPorCentro[selectedCentro] || [];
  }
}
