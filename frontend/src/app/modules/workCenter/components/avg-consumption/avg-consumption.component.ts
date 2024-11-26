import { Component } from '@angular/core';

@Component({
  selector: 'app-avg-consumption',
  templateUrl: './avg-consumption.component.html',
  styleUrl: './avg-consumption.component.css',
})
export class AvgConsumptionComponent {
  options: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  selectedOptions: string[] = [];

  handleSelectionChange(selected: string[]) {
    this.selectedOptions = selected;
    console.log('Opciones seleccionadas en el componente padre:', this.selectedOptions);
  }
}
