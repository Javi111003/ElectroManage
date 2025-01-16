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
  @Input() deleteFunction: (...args: any[]) => any = () => {};
  @Input() editFunction: (item: any) => any = (item) => {};

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

  printCell(element: any): any {
    if (typeof element === "string"){
      const char = 150 / this.displayedColumns.length;
      const result = element.substring(0, char);
      return element.length <= char ? result : result + '...';
    }

    return element;
  }

  printTooltip(element: any): string {
    if (typeof element === "string") {
      const char = 150 / this.displayedColumns.length;
      return element.length > char ? element : ""
    }

    return "";
  }
}
