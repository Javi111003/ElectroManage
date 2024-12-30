import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token');
    let clonedRequest = req.clone();

    if (token) {
      clonedRequest = clonedRequest.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (req.method !== 'GET' && req.method !== 'DELETE') {
        clonedRequest = clonedRequest.clone({
          setHeaders: {
            'Content-Type': 'application/json'
          }
        });
      }

      return next.handle(clonedRequest);
    } else {
      const clone = req.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });

      return next.handle(clone);
    }
  }
}
