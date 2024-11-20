import { Component, Input, OnInit } from '@angular/core';

export interface ConfigColumn {
  title: string;
  field: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
cancelOrDelete() {
throw new Error('Method not implemented.');
}
edit() {
throw new Error('Method not implemented.');
}
createNew() {
throw new Error('Method not implemented.');
}
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: ConfigColumn[] = [];
  @Input() showActions: boolean = false;

  headings: string[] = [];

  ngOnInit(): void {
    this.headings = this.displayedColumns.map(item => item.field)
    console.log(this.dataSource);
    console.log(this.displayedColumns);
    if (this.showActions)
      this.headings.push('actionsColumn')
  }
}
