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


  /**
   * Truncates a string to fit within the width of the table cell, appending ellipsis if necessary.
   *
   * @param element - The content of the cell, which can be of any type.
   * @returns The truncated string with ellipsis if the original string exceeds the allowed length,
   *          or the original element if it is not a string.
   */
  printCell(element: any): any {
    if (typeof element === "string"){
      const char = 150 / this.displayedColumns.length;
      const result = element.substring(0, char);
      return element.length <= char ? result : result + '...';
    }

    return element;
  }


  /**
   * Generates a tooltip string for a given element based on its length and the number of displayed columns.
   *
   * @param element - The element for which the tooltip is to be generated. It can be of any type, but the function primarily handles strings.
   * @returns A tooltip string if the element is a string and its length exceeds a calculated threshold; otherwise, an empty string.
   */
  printTooltip(element: any): string {
    if (typeof element === "string") {
      const char = 150 / this.displayedColumns.length;
      return element.length > char ? element : ""
    }

    return "";
  }
}
