import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { TranslationService } from '../services/translation/translation.service';

@Injectable()
// Interceptor to catch requests errors
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog, private translationService: TranslationService) {}

  hasAlerted = false;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error && !this.hasAlerted) {
          this.hasAlerted = true;
          if (error.error.errors) {
            const originalMessage = error.error.errors[0].reason;
            errorMessage = `Ha ocurrido un error: ${this.translationService.translate(originalMessage)}`;
          } else {
            errorMessage = 'Error al establecer la conexión con el servidor';
          }
        } else if (!this.hasAlerted) {
          this.hasAlerted = true
          errorMessage = `Código de error: ${error.status}\nMessage: ${this.translationService.translate(error.message)}`;
        }

        setTimeout(() => {
          this.hasAlerted = false;
        }, 5000);

        if (errorMessage !== '') {
          this.dialog.open(DialogComponent, {
            data: { message: errorMessage }
          });
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
