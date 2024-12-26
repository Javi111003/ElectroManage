import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorModifierComponent } from './paginator.modifier';

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
  @Input() showFooter: boolean = false;
  @Input() deleteFunction: (...args: any[])=>any = this.cancelOrDelete;
  @Input() editFunction: (item: any)=>any = this.edit;

  @ViewChild(MatPaginator) paginator: MatPaginator = [][0];

  headings: string[] = [];

  ngAfterViewInit() {
    if (this.paginator && this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    this.headings = this.displayedColumns.map(item => item.field)
    if (this.showActions) {
      this.headings.push('editColumn');
      this.headings.push('deleteColumn');
    }
  }

  cancelOrDelete() {}

  edit(item: any) {}
}
