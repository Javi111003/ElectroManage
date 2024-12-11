import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';  // Importar Reactive Forms
import { GlobalModule } from '../../../../global/global.module'  // Suponiendo que el GlobalModule existe en tu aplicación

@Component({
  selector: 'app-policy-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent {
  form: FormGroup; // Formulario reactivo

  constructor(private fb: FormBuilder, public global: GlobalModule) {
    // Creamos el formulario con validaciones
    this.form = this.fb.group({
      policyName: ['', Validators.required],
      description: ['', Validators.required],
      workCenter: ['', Validators.required],  
    });
  }

  ngOnInit() {}
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
