import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { Policy } from '../../../../../models/policy.interface';
import { WorkCenter } from '../../../../../models/workCenter.interface';

declare var bootstrap: any;  // Declaración de bootstrap para evitar errores de compilación
@Component({
  selector: 'app-policy-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Nombre',
      field: 'name'
    },
    {
      title: 'Descripcion',
      field: 'description'
    }
  ];


   polices:Policy[] = [
    { id: 1, name: 'Politica Messi-Ronaldo', applyingDate: "HACE DOS HORAS",companyId:101 },
    { id: 2, name: 'Politica Vinicius', applyingDate: 'AYER',companyId:102 },
    { id: 1, name: 'Politica Messi-Ronaldo', applyingDate: "HACE DOS HORAS",companyId:101 },
    { id: 2, name: 'Politica Vinicius', applyingDate: 'AYER',companyId:102 },
    { id: 1, name: 'Politica Messi-Ronaldo', applyingDate: "HACE DOS HORAS",companyId:101 },
    { id: 2, name: 'Politica Vinicius', applyingDate: 'AYER',companyId:102 },
    { id: 1, name: 'Politica Messi-Ronaldo', applyingDate: "HACE DOS HORAS",companyId:101 },
    { id: 2, name: 'Politica Vinicius', applyingDate: 'AYER',companyId:102 },
    { id: 1, name: 'Politica Messi-Ronaldo', applyingDate: "HACE DOS HORAS",companyId:101 },
    { id: 2, name: 'Politica Vinicius', applyingDate: 'AYER',companyId:102 },
    { id: 1, name: 'Politica Messi-Ronaldo', applyingDate: "HACE DOS HORAS",companyId:101 },
    { id: 2, name: 'Politica Vinicius', applyingDate: 'AYER',companyId:102 },
    { id: 1, name: 'Politica Messi-Ronaldo', applyingDate: "HACE DOS HORAS",companyId:101 },
    { id: 2, name: 'Politica Vinicius', applyingDate: 'AYER',companyId:102 },
    { id: 1, name: 'Politica Messi-Ronaldo', applyingDate: "HACE DOS HORAS",companyId:101 },
    { id: 2, name: 'Politica Vinicius', applyingDate: 'AYER',companyId:102 },
    { id: 1, name: 'Politica Messi-Ronaldo', applyingDate: "HACE DOS HORAS",companyId:101 },
    { id: 2, name: 'Politica Vinicius', applyingDate: 'AYER',companyId:102 },{ id: 1, name: 'Politica Messi-Ronaldo', applyingDate: "HACE DOS HORAS",companyId:101 },
    { id: 2, name: 'Politica Vinicius', applyingDate: 'AYER',companyId:102 },

    
  ];
  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.polices);
  }
  onClick(): void {
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
}

}
