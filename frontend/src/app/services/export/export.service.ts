import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MENU_OPTIONS_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private http: HttpClient) { }

  /**
   * gets the document to download.
   * @returns A string with de document encoded.
   */
  getDocument(route: string): Observable<string> {
    return this.http.get<string>(route);
  }
}
