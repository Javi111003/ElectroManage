import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrl: './no-results.component.css'
})
export class NoResultsComponent {
  @Input() label: string = "No se encontraron resultados para esa consulta";
}
