import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MENU_OPTIONS_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private http: HttpClient) { }

  /**
   * get the main menu options from a .json file.
   * @returns An observable that emits the menu items.
   */
  getMenuOptions(): Observable<any> {
    return this.http.get<any>(MENU_OPTIONS_URL);
  }
}
