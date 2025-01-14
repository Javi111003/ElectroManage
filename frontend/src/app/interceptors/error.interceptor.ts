import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';

@Injectable()
// Interceptor to catch requests errors
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error Inesperado!';
        if (error.error) {
          if (error.error.errors)
            errorMessage = `Error: ${error.error.errors[0].reason}`;
          else
            errorMessage = 'Error al establecer la conexión con el servidor'
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        this.dialog.open(DialogComponent, {
          data: { message: errorMessage }
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
