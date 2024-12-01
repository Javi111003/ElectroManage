import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class PaginatorModifierComponent extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos por página';
  override nextPageLabel = 'Siguiente';
  override previousPageLabel = 'Anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';
}
