import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';  // Importar Reactive Forms
import { GlobalModule } from '../../../../global/global.module'  // Suponiendo que el GlobalModule existe en tu aplicación
import { DataService } from '../../../../../services/data/data.service';

@Component({
  selector: 'app-policy-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent implements OnInit {
  @Input() selectedItem: any = null;
  form: FormGroup; // Formulario reactivo
  data: any;

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService
  ) {
    // Creamos el formulario con validaciones
    this.form = this.fb.group({
      policyName: ['', Validators.required],
      description: ['', Validators.required],
      workCenter: ['', Validators.required],
    });
  }

  workCenters: string[] = [
    'centro 1', 'centro 2'
  ]

  ngOnInit(): void {
    this.dataService.currentData.subscribe(newData => {
      this.data = newData;
      this.form.patchValue(this.data);
    });
  }

  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  // Function to handle modal closure and reset the form
  onCloseModal(): void {
    this.form.reset(); // Reset the form when the modal closes
  }

  // Function to handle form submission
  onSubmit(): void {
    if (this.form.invalid) {
      confirm('Please fill in all fields.'); // Prompt to fill all fields
      this.markAllAsTouched(); // Mark all fields as touched to show errors
      return;
    }

    const confirmation = confirm('Are you sure you want to save the changes?'); // Confirmation before saving
    if (confirmation) {
      window.location.reload();  // Reload the page
    }
  }

  // Mark all fields in the form as touched
  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control?.markAsTouched(); // Mark each control as touched
    });
  }
}
