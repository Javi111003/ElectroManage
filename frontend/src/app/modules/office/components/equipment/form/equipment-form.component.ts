import { EquipmentInstance, EquipmentSpecificationEdited } from './../../../../../models/equipment.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { OfficeService } from '../../../../../services/office/office.service';
import { EquipmentBrand, EquipmentSpecification, EquipmentType, EquipPropertyInfo } from '../../../../../models/equipment.interface';
import { Subscription } from 'rxjs';
import $ from 'jquery';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrl: './equipment-form.component.css'
})
export class EquipmentFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  @Input() data: any;
  enableAddType: boolean = false;
  enableAddBrand: boolean = false;
  postMethod: boolean = true;

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private officeService: OfficeService
  )
  {
    const today = new Date();
    this.form = this.fb.group({
      workCenter: ['', Validators.required],
      office: ['', Validators.required],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      useFrequency: ['', Validators.required],
      maintenanceStatus: ['', Validators.required],
      efficiency: [null, Validators.required],
      capacity: [null, Validators.required],
      criticalEnergySystem: [null, Validators.required],
      averageConsumption: [null, Validators.required],
      lifeSpanYears: [null, Validators.required],
      instalationDate: [today, Validators.required],
    });
    this.dataService.setData(null);


    this.form.get('type')!.valueChanges.subscribe(() => {
      if (String(this.getControlValue('type')).trim() == '') {
        this.enableAddType = false;
        return;
      }

      this.enableAddType = !this.global.isOptionValid(
        this.typeStringArray,
        this.getControlValue('type')
      );
    });

    this.form.get('brand')!.valueChanges.subscribe(() => {
      if (String(this.getControlValue('brand')).trim() == '') {
        this.enableAddBrand = false;
        return;
      }

      this.enableAddBrand = !this.global.isOptionValid(
        this.brandStringArray,
        this.getControlValue('brand')
      );
    });
  }

  form: FormGroup;

  useFrequencies: string[] = [
    'Alta', 'Media', 'Baja'
  ];
  useFrequencyMatch: Map<string, string> = new Map<string, string>([
    ['Alta', 'High'],
    ['Media', 'Medium'],
    ['Baja', 'Low']
  ])

  maintenanceStatus: string[] = [
    'Bueno', 'Regular', 'Malo'
  ];
  maintenanceStatusMatch: Map<string, string> = new Map<string, string>([
    ['Bueno', 'Good'],
    ['Regular', 'Regular'],
    ['Malo', 'Bad']
  ]);
  criticalMatch: Map<string, boolean> = new Map<string, boolean>([
    ['Sí', true],
    ['No', false]
  ])

  typeStringArray: string[] = [];
  typeObjectArray: EquipPropertyInfo[] = [];

  brandStringArray: string[] = [];
  brandObjectArray: EquipPropertyInfo[] = [];

  ngOnInit() {
    const sub = this.dataService.currentData.subscribe(newData => {
      if (newData) {
        this.data = newData[0];
        const post = newData[3];
        this.form.patchValue(this.data);
        this.getControl('workCenter').setValue(newData[1]);
        this.getControl('office').setValue(newData[2]);
        if (this.data) {
          this.getControl('criticalEnergySystem').setValue(this.criticalMatch.get(this.data.criticalEnergySystem));
          if (this.data.instalationDate) {
            const dateString = this.data.instalationDate;
            const dateParts = dateString.split('-');
            const dateObject = new Date(Date.UTC(+dateParts[0], +dateParts[1] - 1, +dateParts[2] + 1));
            this.getControl('instalationDate').setValue(dateObject);
          }
        }
        this.postMethod = post;
        console.log(this.data);
      }
    });

    this.subscriptions.add(sub);

    this.global.Reset();
    this.global.getWorkCenters();
    this.getTypes();
    this.getBrands();

    this.form.get('workCenter')?.valueChanges.subscribe(() => {
      this.getControl('office').reset();
      if (this.global.isOptionValid(
        this.global.centerStringArray,
        this.getControlValue('workCenter')
        )
      ) {
        this.global.findCenterId(this.getControlValue('workCenter'));
        this.global.getOfficesByCenter(this.global.centerSelectedId);
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * This function is used to get the form control by its name.
   * @param control The name of the form control.
   * @returns The form control with the specified name.
   */
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  /**
   * This function is used to get the value of a form control by its name.
   * @param control The name of the form control.
   * @returns The value of the form control with the specified name.
   */
  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  /**
   * Closes the modal and resets the form.
   * This function is called when the user clicks the 'Cerrar' button in the modal.
   * It resets the form to its initial state, including the installation date.
   */
  onCloseModal(): void {
    this.form.reset();
    this.enableAddBrand = this.enableAddType = false;
    const today = new Date();
    this.getControl('instalationDate').setValue(today);
  }

  /**
   * Submits the equipment form after validation.
   * This function is called when the user clicks the 'Guardar cambios' button in the modal.
   * It checks if the form is valid, then prompts the user for confirmation before submitting the form.
   * If the form is invalid or the user cancels the submission, it displays an error message.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.global.openDialog('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      return;
    }

    const searchFrom = [
      this.global.centerStringArray, this.global.officeStringArray,
      this.typeStringArray, this.brandStringArray, this.useFrequencies,
      this.maintenanceStatus
    ];
    const options = [
      this.getControlValue('workCenter'), this.getControlValue('office'),
      this.getControlValue('type'), this.getControlValue('brand'),
      this.getControlValue('useFrequency'), this.getControlValue('maintenanceStatus')
    ];
    const response = [
      'Centro de Trabajo', 'Nombre de Oficina', 'Tipo de Instalación',
      'Nombre de Marca', 'Tipo de Frecuencia de Uso', 'Estado de Mantenimiento'
    ];
    const valid = this.global.AllValid(searchFrom, options, response);

    if (valid[0]) {
      const confirmation = confirm('¿Está seguro de que desea guardar los cambios?');
      if (confirmation) {
        if (this.postMethod)
          this.createEquipment();
        else {
          this.editEquipment();
          this.postMethod = true;
        }
      }
    } else {
        this.global.openDialog(`Por favor, selecciona un ${valid[1]} válido.`);
      }
  }

  /**
   * Marks all form controls as touched.
   * This function is used to mark all form controls as touched, indicating that the user has interacted with them.
   * It iterates over each control in the form and calls the markAsTouched method on each control.
   */
  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.getControl(field);
      control?.markAsTouched();
    });
  }

  /**
   * This function is used to filter the installation date.
   * It checks if the date is in the past or today.
   * @param d The date to be filtered.
   * @returns A boolean value indicating if the date is valid.
   */
  filterInstalationDate = (d: Date | null): boolean => {
    const today = new Date();
    const Tday = today.getDate();
    const Tmonth = today.getMonth();
    const Tyear = today.getFullYear();

    const day = d?.getDate();
    const month = d?.getMonth();
    const year = d?.getFullYear();

    if (year !== undefined && month !== undefined && day !== undefined &&
      (year < Tyear || (year === Tyear && (month < Tmonth) || (month === Tmonth && day <= Tday))))
      return true;

    return false
  };

  /**
   * Adds a new equipment type.
   * This function is used to add a new equipment type to the system.
   * It toggles the enableAddType flag, constructs a new EquipmentType object,
   * and posts it to the server. If successful, it retrieves the updated list of types.
   */
  addType(): void {
    this.enableAddType = !this.enableAddType;
    const eqType: EquipmentType = {
      name: this.getControlValue('type'),
      description: null
    }
    this.officeService.postEquipmentType(eqType).subscribe({
      next: (response) => {
        console.log('Created successfully:', response);
        this.getTypes();
      },
      error: (error) => {
        this.global.openDialog(error.error.errors[0].reason);
      }
    });
  }

  /**
   * Deletes an equipment type.
   * This function is used to remove an equipment type from the system.
   * It finds the ID of the type to be deleted, posts the deletion request to the server,
   * and if successful, retrieves the updated list of types.
   * @param typeName The name of the equipment type to be deleted.
   */
  deleteType(typeName: string): void {
    const typeID = this.findId(typeName, this.typeObjectArray);
    this.officeService.deleteEquipmentType(typeID).subscribe({
      next: (response) => {
        console.log('Deleted successfully:', response);
        this.getTypes();
      },
      error: (error) => {
        this.global.openDialog(error.error.errors[0].reason);
      }
    });
  }

  /**
   * Deletes an equipment brand.
   * This function is used to remove an equipment brand from the system.
   * It finds the ID of the brand to be deleted, posts the deletion request to the server,
   * and if successful, retrieves the updated list of brands.
   * @param brandName The name of the equipment brand to be deleted.
   */
  deleteBrand(brandName: string): void {
    const brandID = this.findId(brandName, this.brandObjectArray);
    this.officeService.deleteEquipmentBrand(brandID).subscribe({
      next: (response) => {
        console.log('Deleted successfully:', response);
        this.getBrands();
      },
      error: (error) => {
        this.global.openDialog(error.error.errors[0].reason);
      }
    });
  }

  /**
   * This function is used to add a new brand to the system.
   * It toggles the state of the add brand button, creates a new EquipmentBrand object,
   * and posts the new brand to the server.
   * If successful, it retrieves the updated list of brands.
   */
  addBrand(): void {
    this.enableAddBrand = !this.enableAddBrand;
    const eqBrand: EquipmentBrand = {
      name: this.getControlValue('brand'),
      description: null
    }
    this.officeService.postEquipmentBrand(eqBrand).subscribe({
      next: (response) => {
        console.log('Created successfully:', response);
        this.getBrands();
      },
      error: (error) => {
        this.global.openDialog(error.error.errors[0].reason);
        console.log(eqBrand);
      }
    });
  }

  /**
   * Retrieves the list of equipment types.
   * This function fetches the list of equipment types from the server and updates the component's state.
   * It populates the `typeObjectArray` with the fetched types and `typeStringArray` with their names.
   */
  getTypes(): void {
    this.officeService.getEquipmentTypeList().subscribe(types => {
      this.typeObjectArray = types;
      this.typeStringArray = types.map(type => type.name);
    })
  }

  /**
   * This function retrieves the list of equipment brands.
   * It fetches the list of equipment brands from the server and updates the component's state.
   * It populates the `brandObjectArray` with the fetched brands and `brandStringArray` with their names.
   */
  getBrands(): void {
    this.officeService.getEquipmentBrandList().subscribe(types => {
      this.brandObjectArray = types;
      this.brandStringArray = types.map(type => type.name);
    })
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

  /**
   * Creates a new equipment instance.
   * This function gathers the necessary information from the form controls and creates a new equipment instance.
   * The equipment instance is then posted to the server for creation.
   */
  createEquipment(): void {
    const commonValues = this.getCommonValues();
    const specification: EquipmentSpecification = {
      model: commonValues.model,
      capacity: commonValues.capacity,
      criticalEnergySystem: commonValues.critical,
      averageConsumption: commonValues.avgConsumption,
      lifeSpanYears: commonValues.lifeSpanYears,
      efficiency: commonValues.efficiency,
      equipmentBrandId: commonValues.brandID,
      equipmentTypeId: commonValues.typeID
    };
    this.createOrEditSpecification(false, specification, commonValues);
  }

  /**
   * Edits an equipment instance.
   * This function gathers the necessary information from the form controls and edits an equipment instance.
   * The equipment instance is then put to the server for edition.
   */
  editEquipment(): void {
    const commonValues = this.getCommonValues();
    const specification: EquipmentSpecificationEdited = {
      id: this.data.specifId,
      model: commonValues.model,
      capacity: commonValues.capacity,
      criticalEnergySystem: commonValues.critical,
      averageConsumption: commonValues.avgConsumption,
      lifeSpanYears: commonValues.lifeSpanYears,
      efficiency: commonValues.efficiency,
      equipmentBrandId: commonValues.brandID,
      equipmentTypeId: commonValues.typeID
    };
    this.createOrEditSpecification(true, specification, commonValues);
  }

  /**
   * This function is used to get the common values from the form controls.
   * It retrieves the necessary information from the form controls and returns them as an object.
   * @returns An object containing the common values from the form controls.
   */
  getCommonValues() {
    const typeID = this.findId(this.getControlValue('type'), this.typeObjectArray);
    const brandID = this.findId(this.getControlValue('brand'), this.brandObjectArray);
    const useFrequency = this.useFrequencyMatch.get(this.getControlValue('useFrequency'))!;
    const maintenanceStatus = this.maintenanceStatusMatch.get(this.getControlValue('maintenanceStatus'))!;
    const model = this.getControlValue('model');
    const capacity = this.getControlValue('capacity');
    const critical = this.getControlValue('criticalEnergySystem');
    const avgConsumption = this.getControlValue('averageConsumption');
    const lifeSpanYears = this.getControlValue('lifeSpanYears');
    const efficiency = this.getControlValue('efficiency');
    const installDate = this.getControlValue('instalationDate');
    const office = this.getControlValue('office');

    this.global.findOfficeId(office);

    return {
      typeID, brandID, useFrequency, maintenanceStatus, model, capacity, critical,
      avgConsumption, lifeSpanYears, efficiency, installDate
    };
  }

  /**
   * This function is used to create or edit an equipment specification.
   * It determines whether to create or edit based on the `isEdit` parameter.
   * It calls the appropriate service method (either `editEquipmentSpecification` or `postEquipmentSpecification`)
   * with the provided `specification` and handles the response or error accordingly.
   * If successful, it also creates or edits an equipment instance.
   * @param isEdit A boolean indicating whether to edit or create a new equipment specification.
   * @param specification The equipment specification to be created or edited.
   * @param commonValues The common values required for creating or editing an equipment instance.
   */
  createOrEditSpecification(isEdit: boolean, specification: any, commonValues: any) {
    const serviceMethod = isEdit ? this.officeService.editEquipmentSpecification : this.officeService.postEquipmentSpecification;
    serviceMethod.call(this.officeService, specification).subscribe({
      next: (response) => {
        console.log(isEdit ? 'Edited successfully:' : 'Created successfully:', response);
        const equipment: EquipmentInstance = {
          instalationDate: this.global.formatLocalDate(commonValues.installDate),
          maintenanceStatus: commonValues.maintenanceStatus,
          useFrequency: commonValues.useFrequency,
          equipmentSpecificationId: response.id,
          officeId: this.global.officeSelectedId
        };
        this.createOrEditInstance(isEdit, equipment);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  /**
   * This function is used to create or edit an equipment instance.
   * It determines whether to create or edit based on the `isEdit` parameter.
   * It calls the appropriate service method (either `editEquipmentInstance` or `postEquipmentInstance`)
   * with the provided `equipment` and handles the response or error accordingly.
   * If successful, it notifies the data service to update the data.
   * @param isEdit A boolean indicating whether to edit or create a new equipment instance.
   * @param equipment The equipment instance to be created or edited.
   */
  createOrEditInstance(isEdit: boolean, equipment: EquipmentInstance) {
    const serviceMethod = isEdit ? this.officeService.editEquipmentInstance : this.officeService.postEquipmentInstance;
    serviceMethod.call(this.officeService, equipment, this.data?.id).subscribe({
      next: (response) => {
        console.log(isEdit ? 'Edited successfully:' : 'Created successfully:', response);
        this.dataService.notifyDataUpdated();
        this.activateCloseButton();
      },
      error: (error) => {
        this.handleError(error);
      }
    });
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
}
