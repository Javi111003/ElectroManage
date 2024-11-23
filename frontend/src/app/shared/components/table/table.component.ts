import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface ConfigColumn {
  title: string;
  field: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() dataSource: MatTableDataSource<any> = [][0];
  @Input() displayedColumns: ConfigColumn[] = [];
  @Input() showActions: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator = [][0];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  headings: string[] = [];

  ngOnInit(): void {
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

  createNew() {
    throw new Error('Method not implemented.');
  }
}
