import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSource = new BehaviorSubject<any>({});
  currentData = this.dataSource.asObservable();

  constructor() {}

  changeData(data: any) {
    this.dataSource.next(data);
  }

  getData() {
    return this.dataSource.value;
  }

  setData(newData: any) {
    this.dataSource.next(newData);
  }
}
