import { GlobalModule } from './../../../global/global.module';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import { Policy } from '../../../../models/policy.interface';

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

  optionsPolicy: string[] = [];
  objectsPolicy: Policy[] = [];

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

  /**
   * Handles the click event on the policy component.
   * Checks if a valid center and policy are selected, and if so, sets the table to be active.
   * If not, displays an alert message.
   */
  onClick() {
    if (this.global.isOptionValid(this.global.centerStringArray, this.centerSelected) &&
      this.global.isOptionValid(this.optionsPolicy, this.policySelected)) {
      this.isTableActive = true;
    } else {
      this.isTableActive = false;
      this.global.openDialog('Por favor, selecciona un Centro de Trabajo y una Política.');
    }
  }

  /**
   * Retrieves policies based on the selected center ID.
   * Updates the optionsPolicy array with the names of the policies.
   * @param centerSelectedId The ID of the selected center.
   */
  getPolicies(centerSelectedId: any) {
    this.global.httpCenter.getPolicies(centerSelectedId).subscribe(policies => {
      this.objectsPolicy = policies;
      this.optionsPolicy = policies.map(policy => policy.name);
    });
  }

  /**
   * Handles changes to the center input.
   * Resets the policy selection and updates the policies based on the new center selection.
   * @param value The new value of the center input.
   */
  onCenterInputModified(value: string) {
    this.centerSelected = value;
    this.isTableActive = false;
    this.policySelected = null!;
    this.policySelectedId = 0;

    if (this.global.isOptionValid(this.global.centerStringArray, this.centerSelected)) {
      this.global.findCenterId(this.centerSelected);
      this.getPolicies(this.global.centerSelectedId);
    }

    else if (this.policyAutocomplete) {
      this.policyAutocomplete.resetControl();
      this.optionsPolicy = [];
    }
  }

  /**
   * Handles changes to the policy input.
   * Resets the table activity state.
   * @param value The new value of the policy input.
   */
  onPolicyInputModified(value: string) {
    this.policySelected = value;
    this.isTableActive = false;
  }
}
