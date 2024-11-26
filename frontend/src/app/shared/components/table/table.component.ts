import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorModifierComponent } from './paginator-modifier.component';

export interface ConfigColumn {
  title: string;
  field: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: PaginatorModifierComponent }
  ],
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() dataSource: MatTableDataSource<any> = [][0];
  @Input() displayedColumns: ConfigColumn[] = [];
  @Input() showActions: boolean = false;
  @Input() footer: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator = [][0];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  headings: string[] = [];

  ngOnInit(): void {
    console.log(this.footer);
    this.headings = this.displayedColumns.map(item => item.field)
    if (this.showActions)
      this.headings.push('actionsColumn')
  }

  cancelOrDelete() {
    throw new Error('Method not implemented.');
  }

  edit() {
    throw new Error('Method not implemented.');
  }
}
