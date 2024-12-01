import { GlobalModule } from './../../../global/global.module';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.css'
})
export class PolicyComponent implements OnInit {

  constructor(
    public global: GlobalModule
  ) {}

  @ViewChild('policyAutocomplete') policyAutocomplete!: AutocompleteComponent;

  centerSelected: string = '';
  centerSelectedId: number = 0;

  policySelected: string = '';
  policySelectedId: number = 0;

  optionsPolicy: string[] = [
    'politica 1', 'politica 2'
  ];
  isTableActive: boolean = false;
  dataSourceBefore: MatTableDataSource<any> = [][0];
  dataSourceAfter: MatTableDataSource<any> = [][0];
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Día',
      field: 'registerDate'
    },
    {
      title: 'Consumo (Kw/h)',
      field: 'consumption'
    },
    {
      title: 'Costo ($)',
      field: 'cost'
    }
  ];


  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
  }

  ngAfterViewInit(): void { }

  onClick() {
    if (this.isOptionValid(this.global.centerStringArray, this.centerSelected) &&
      this.isOptionValid(this.optionsPolicy, this.policySelected)) {
      this.isTableActive = true;
    } else {
      this.isTableActive = false;
      alert('Por favor, selecciona un Centro de Trabajo y una Política.');
    }
  }

  onCenterInputModified(value: string) {
    this.centerSelected = value;
    this.isTableActive = false;
    this.policySelected = null!;
    this.policySelectedId = 0;

    if (this.isOptionValid(this.global.centerStringArray, this.centerSelected)) {
      this.optionsPolicy = [
        'politica 1', 'politica 2'
      ];
    }

    else if (this.policyAutocomplete) {
      this.policyAutocomplete.resetControl();
      this.optionsPolicy = [];
    }
  }

  onPolicyInputModified(value: string) {
    this.policySelected = value;
    this.isTableActive = false;
  }

  isOptionValid(array: string[], option: string): boolean {
    for (let index = 0; index < array.length; index++) {
      if (option === array[index])
        return true;
    }

    return false;
  }
}
