import { EquipmentInstance, EquipmentSpecificationEdited } from './../../../../../models/equipment.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { OfficeService } from '../../../../../services/office/office.service';
import { EquipmentBrand, EquipmentSpecification, EquipmentType } from '../../../../../models/equipment.interface';
import { Subscription } from 'rxjs';
import { Item } from '../../../../../shared/shared.module';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrl: './equipment-form.component.css'
})
export class EquipmentFormComponent implements OnInit, OnDestroy {
  @Input() data: any;
  private subscriptions: Subscription = new Subscription();
  postMethod: boolean = true;
  loading: boolean = false;
  form: FormGroup;
  enableAddType: boolean = false;
  typeArray: Item[] = [];
  enableAddBrand: boolean = false;
  brandArray: Item[] = [];
  useFrequencies: Item[] = [
    { id: 1, name: 'Alta' },
    { id: 2, name: 'Media' },
    { id: 3, name: 'Baja' }
  ];
  useFrequencyMatch: Map<string, string> = new Map<string, string>([
    ['Alta', 'High'],
    ['Media', 'Medium'],
    ['Baja', 'Low']
  ]);
  maintenanceStatus: Item[] = [
    { id: 1, name: 'Bueno' },
    { id: 2, name: 'Regular' },
    { id: 3, name: 'Malo' }
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

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private officeService: OfficeService,
    private snackbar: SnackbarService
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
      if (String(this.global.getControlValue(this.form, 'type')).trim() == '') {
        this.enableAddType = false;
        return;
      }

      if (this.global.getControlValue(this.form, 'type')) {
        this.enableAddType = !this.global.getControlValue(this.form, 'type').id;
      }
    });

    this.form.get('brand')!.valueChanges.subscribe(() => {
      if (this.global.getControlValue(this.form, 'brand') && this.global.getControlValue(this.form, 'brand').id) {
        this.enableAddBrand = false;
        return;
      }

      if (this.global.getControlValue(this.form, 'brand')) {
        this.enableAddBrand = !this.global.getControlValue(this.form, 'brand').id;
      }
    });
  }

  ngOnInit() {
    const sub = this.dataService.currentData.subscribe(newData => {
      if (newData) {
        this.data = newData[0];
        const post = newData[3];

        this.form.patchValue(this.data);
        this.global.getControl(this.form, 'workCenter').setValue(newData[1]);
        this.global.getControl(this.form, 'office').setValue(newData[2]);

        if (this.data) {
          const type: Item = {
            id: this.data.typeId,
            name: this.data.type
          };
          const brand: Item = {
            id: this.data.brandId,
            name: this.data.brand
          };
          const useFrequency = this.useFrequencies.find(item => item.name === this.data.useFrequency);
          const maintenanceStatus = this.maintenanceStatus.find(item => item.name === this.data.maintenanceStatus);

          this.global.getControl(this.form, 'type').setValue(type);
          this.global.getControl(this.form, 'brand').setValue(brand);
          this.global.getControl(this.form, 'useFrequency').setValue(useFrequency);
          this.global.getControl(this.form, 'maintenanceStatus').setValue(maintenanceStatus);
          this.global.getControl(this.form, 'criticalEnergySystem').setValue(this.criticalMatch.get(this.data.criticalEnergySystem));

          if (this.data.instalationDate) {
            const dateString = this.data.instalationDate;
            const dateParts = dateString.split('-');
            const dateObject = new Date(Date.UTC(+dateParts[0], +dateParts[1] - 1, +dateParts[2] + 1));
            this.global.getControl(this.form, 'instalationDate').setValue(dateObject);
          }
        }
        this.postMethod = post;
      }
    });

    this.subscriptions.add(sub);
    this.global.Reset();
    this.global.getWorkCenters();
    this.getTypes();
    this.getBrands();

    this.form.get('workCenter')?.valueChanges.subscribe(() => {
      this.global.getControl(this.form, 'office').reset();
      if (this.global.getControlValue(this.form, 'workCenter')) {
        const id = this.global.getControlValue(this.form, 'workCenter').id;
        if (id) {
          this.global.getOfficesByCenter(id);
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Checks if a control is disabled based on its id.
   * @param control The control to check.
   * @returns True if the control is not null and has an id, otherwise false.
   */
  checkDisabled(control: any): boolean {
    if (control) {
      return control.id;
    }

    return false;
  }

  /**
   * Closes the modal and resets the form.
   * This function is called when the user clicks the 'Cerrar' button in the modal.
   * It resets the form to its initial state, including the installation date.
   */
  onCloseModal(): void {
    this.loading = false;
    this.form.reset();
    this.enableAddBrand = this.enableAddType = false;
    const today = new Date();
    this.global.getControl(this.form, 'instalationDate').setValue(today);
  }

  /**
   * Submits the equipment form after validation.
   * This function is called when the user clicks the 'Guardar cambios' button in the modal.
   * It checks if the form is valid, then prompts the user for confirmation before submitting the form.
   * If the form is invalid or the user cancels the submission, it displays an error message.
   */
  onSubmit(): void {
    this.loading = true;
    if (this.form.invalid) {
      this.global.openDialog('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      this.loading = false;
      return;
    }

    const options = [
      this.global.getControlValue(this.form, 'workCenter').id, this.global.getControlValue(this.form, 'office').id,
      this.global.getControlValue(this.form, 'type').id, this.global.getControlValue(this.form, 'brand').id,
      this.global.getControlValue(this.form, 'useFrequency').id, this.global.getControlValue(this.form, 'maintenanceStatus').id
    ];
    const response = [
      'Centro de Trabajo', 'Nombre de Oficina', 'Tipo de Equipo',
      'Nombre de Marca', 'Tipo de Frecuencia de Uso', 'Estado de Mantenimiento'
    ];
    const valid = this.global.allValid(options, response);

    if (valid[0]) {
      this.global.openDialog('¿Está seguro de que desea guardar los cambios?', true).subscribe(
        result =>{
          if (result) {
            if (this.postMethod)
              this.createEquipment();
            else {
              this.editEquipment();
            }
          } else {
            this.loading = false;
          }
      });
    } else {
      this.global.openDialog(`Por favor, selecciona un ${valid[1]} válido.`);
      this.loading = false;
    }
  }

  /**
   * Marks all form controls as touched.
   * This function is used to mark all form controls as touched, indicating that the user has interacted with them.
   * It iterates over each control in the form and calls the markAsTouched method on each control.
   */
  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.global.getControl(this.form, field);
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

    return false;
  };

  /**
   * Adds a new equipment type.
   * This function is used to add a new equipment type to the system.
   * It toggles the enableAddType flag, constructs a new EquipmentType object,
   * and posts it to the server. If successful, it retrieves the updated list of types.
   */
  addType(): void {
    this.enableAddType = false;
    const eqType: EquipmentType = {
      name: this.global.getControlValue(this.form, 'type'),
      description: null
    };
    this.officeService.postEquipmentType(eqType).subscribe({
      next: (response) => {
        console.log('Created successfully:', response);
        this.snackbar.openSnackBar('Añadido exitosamente...');
        this.getTypes();
        this.global.getControl(this.form, 'type').setValue(
          {
            id: response.id,
            name: response.name
          }
        );
      },
      error: (error) => {
        console.log(error);
        this.snackbar.openSnackBar('Error al añadir, intente de nuevo...');
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
  deleteType(type: Item): void {
    const eqType = this.global.getControlValue(this.form, 'type');
    if (eqType && eqType.id == type.id)
      this.global.getControl(this.form, 'type').setValue("");

    this.officeService.deleteEquipmentType(type.id).subscribe({
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
   * Deletes an equipment brand.
   * This function is used to remove an equipment brand from the system.
   * It finds the ID of the brand to be deleted, posts the deletion request to the server,
   * and if successful, retrieves the updated list of brands.
   * @param brandName The name of the equipment brand to be deleted.
   */
  deleteBrand(brand: Item): void {
    const brandName = this.global.getControlValue(this.form, 'brand');
    if (brandName && brandName.id == brand.id)
      this.global.getControl(this.form, 'brand').setValue("");

    this.officeService.deleteEquipmentBrand(brand.id).subscribe({
      next: (response) => {
        console.log('Deleted successfully:', response);
        this.snackbar.openSnackBar('Eliminado exitosamente...');
        this.getBrands();
      },
      error: (error) => {
        console.log(error);
        this.snackbar.openSnackBar('Error al eliminar, intente de nuevo...');
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
      name: this.global.getControlValue(this.form, 'brand'),
      description: null
    };
    this.officeService.postEquipmentBrand(eqBrand).subscribe({
      next: (response) => {
        console.log('Created successfully:', response);
        this.snackbar.openSnackBar('Añadido exitosamente...');
        this.getBrands();
        this.global.getControl(this.form, 'brand').setValue(
          {
            id: response.id,
            name: response.name
          }
        );
      },
      error: (error) => {
        console.log(error);
        this.snackbar.openSnackBar('Error al eliminar, intente de nuevo...');
      }
    });
  }

  /**
   * Retrieves the list of equipment types.
   * This function fetches the list of equipment types from the server and updates the component's state.
   */
  getTypes(): void {
    this.officeService.getEquipmentTypeList().subscribe(types => {
      this.typeArray = types.map(type => {
        return {
          id: type.id,
          name: type.name
        }
      });
    });
  }

  /**
   * This function retrieves the list of equipment brands.
   * It fetches the list of equipment brands from the server and updates the component's state.
   */
  getBrands(): void {
    this.officeService.getEquipmentBrandList().subscribe(brands => {
      this.brandArray = brands.map(brand => {
        return {
          id: brand.id,
          name: brand.name
        }
      })
    })
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
    const typeID = this.global.getControlValue(this.form, 'type').id;
    const brandID = this.global.getControlValue(this.form, 'brand').id;
    const useFrequency = this.useFrequencyMatch.get(this.global.getControlValue(this.form, 'useFrequency').name)!;
    const maintenanceStatus = this.maintenanceStatusMatch.get(this.global.getControlValue(this.form, 'maintenanceStatus').name)!;
    const model = this.global.getControlValue(this.form, 'model');
    const capacity = this.global.getControlValue(this.form, 'capacity');
    const critical = this.global.getControlValue(this.form, 'criticalEnergySystem');
    const avgConsumption = this.global.getControlValue(this.form, 'averageConsumption');
    const lifeSpanYears = this.global.getControlValue(this.form, 'lifeSpanYears');
    const efficiency = this.global.getControlValue(this.form, 'efficiency');
    const installDate = this.global.getControlValue(this.form, 'instalationDate');

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
          officeId: this.global.getControlValue(this.form, 'office').id
        };
        this.createOrEditInstance(isEdit, equipment);
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
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
        const mssg = isEdit ? 'Editado exitosamente...' : 'Añadido exitosamente...';
        this.snackbar.openSnackBar(mssg);
        this.dataService.notifyDataUpdated();
        this.activateCloseButton();
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
        const mssg = isEdit ? 'editar' : 'añadir';
        this.snackbar.openSnackBar(`Error al ${mssg}, intente de nuevo...`);
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
}
