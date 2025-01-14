import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSource = new BehaviorSubject<any>({});
  currentData = this.dataSource.asObservable();
  private dataUpdated = new Subject<void>();
  dataUpdated$ = this.dataUpdated.asObservable();

  /**
   * Fetches the current data from the data source.
   * @returns The current data from the data source.
   */
  getData() {
    return this.dataSource.value;
  }

  /**
   * Sets the current data in the data source.
   * @param newData The new data to be set.
   */
  setData(newData: any) {
    this.dataSource.next(newData);
  }

  /**
   * This function is used to notify the subscribers that the data has been updated.
   * It triggers the dataUpdated$ observable.
   */
  notifyDataUpdated() {
    this.dataUpdated.next();
  }
}
