import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private jsonUrl = 'assets/menu-options.json';

  constructor(private http: HttpClient) { }

  /**
   * get the main menu options from a .json file.
   * @returns An observable that emits the menu items.
   */
  getMenuOptions(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }
}
