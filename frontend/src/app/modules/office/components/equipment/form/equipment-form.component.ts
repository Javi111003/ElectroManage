import { EquipmentInstance } from './../../../../../models/equipment.interface';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { OfficeService } from '../../../../../services/office/office.service';
import { EquipmentBrand, EquipmentSpecification, EquipmentType, EquipPropertyInfo } from '../../../../../models/equipment.interface';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrl: './equipment-form.component.css'
})
export class EquipmentFormComponent {
  @Input() data: any;
  enableAddType: boolean = false;
  enableAddBrand: boolean = false;

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
      equipmentType: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      useFrequency: ['', Validators.required],
      maintenanceStatus: ['', Validators.required],
      efficiency: [null, Validators.required],
      capacity: [null, Validators.required],
      critical: [null, Validators.required],
      avgConsumption: [null, Validators.required],
      yearsLife: [null, Validators.required],
      instalationDate: [today, Validators.required],
    });
    this.dataService.setData(null);


    this.form.get('equipmentType')!.valueChanges.subscribe(() => {
      if (String(this.getControlValue('equipmentType')).trim() == '') {
        this.enableAddType = false;
        return;
      }

      this.enableAddType = !this.global.isOptionValid(
        this.typeStringArray,
        this.getControlValue('equipmentType')
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
  ])

  typeStringArray: string[] = [];
  typeObjectArray: EquipPropertyInfo[] = [];

  brandStringArray: string[] = [];
  brandObjectArray: EquipPropertyInfo[] = [];

  ngOnInit() {
    this.dataService.currentData.subscribe(newData => {
      if (newData) {
        this.data = newData[0];
        this.form.patchValue(this.data);
        this.getControl('workCenter').setValue(newData[1]);
        this.getControl('office').setValue(newData[2]);
      }
    });

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

    if (this.global.isOptionValid(this.global.centerStringArray, this.getControlValue('workCenter')) &&
        this.global.isOptionValid(this.global.officeStringArray, this.getControlValue('office'))) {
          const confirmation = confirm('¿Está seguro de que desea guardar los cambios?');
          if (confirmation) {
            this.createEquipment();
          }
    } else {
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo y una Oficina válidos.');
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
      name: this.getControlValue('equipmentType'),
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
   * It posts the equipment specification to the server and then uses the response to create an equipment instance.
   * The equipment instance is then posted to the server for creation.
   */
  createEquipment(): void {
    const typeID = this.findId(
      this.getControlValue('equipmentType'),
      this.typeObjectArray
    );
    const brandID = this.findId(
      this.getControlValue('brand'),
      this.brandObjectArray
    );
    const useFrequency = this.useFrequencyMatch.get(
      this.getControlValue('useFrequency')
    )!;
    const maintenanceStatus = this.maintenanceStatusMatch.get(
      this.getControlValue('maintenanceStatus')
    )!;
    const model = this.getControlValue('model');
    const capacity = this.getControlValue('capacity');
    const critical = this.getControlValue('critical');
    const avgConsumption = this.getControlValue('avgConsumption');
    const lifeSpanYears = this.getControlValue('yearsLife');
    const efficiency = this.getControlValue('efficiency');
    const installDate = this.getControlValue('instalationDate');
    const office = this.getControlValue('office');

    this.global.findOfficeId(office);

    const specification: EquipmentSpecification = {
      model: model,
      capacity: capacity,
      criticalEnergySystem: critical,
      averageConsumption: avgConsumption,
      lifeSpanYears: lifeSpanYears,
      efficiency: efficiency,
      equipmentBrandId: brandID,
      equipmentTypeId: typeID
    };

    this.officeService.postEquipmentSpecification(specification).subscribe({
      next: (response) => {
        console.log('Created successfully:', response);
        const equipment: EquipmentInstance = {
          instalationDate: installDate.toISOString(),
          maintenanceStatus: maintenanceStatus,
          useFrequency: useFrequency,
          equipmentSpecificationId: response.id,
          officeId: this.global.officeSelectedId
        };

        console.log(equipment);

        this.officeService.postEquipmentInstance(equipment).subscribe({
          next: (response) => {
            console.log('Created successfully:', response);
            window.location.reload();
          },
          error: (error) => {
            if(error.error)
              this.global.openDialog(error.error.errors[0].reason);
            else
              this.global.openDialog('No se ha podido guardar correctamente. Error inesperado');
          }
        })
      },
      error: (error) => {
        if (error.statusText === 'Unknown Error')
          this.global.openDialog("Falló la conexión. Intente de nuevo");
        else if(error.error)
          this.global.openDialog(error.error.errors[0].reason);
        else
          this.global.openDialog('No se ha podido guardar correctamente. Error inesperado');
      }
    });
  }
}
