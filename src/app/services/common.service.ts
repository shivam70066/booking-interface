import { Injectable } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  private hotelIdSubject = new BehaviorSubject<number>(0);
  private showInterface = new  BehaviorSubject<boolean>(false);
  private pageTitle = new  BehaviorSubject<string>("");


  hotelId$ = this.hotelIdSubject.asObservable();
  showInterface$ = this.showInterface.asObservable();
  pageTitle$ = this.pageTitle.asObservable();

  setHotelId(id: number): void {
    this.hotelIdSubject.next(id);
  }

  setPagetitle(title: string){
    this.pageTitle.next(title);
  }

  setInterfaceStatus(state: boolean){
    this.showInterface.next(state);
  }

  formatNgbDate(date: NgbDate): string {
    if (date) {
      const month = date.month < 10 ? `0${date.month}` : `${date.month}`;
      const day = date.day < 10 ? `0${date.day}` : `${date.day}`;
      return `${month}-${day}-${date.year}`;
    }
    return '';
  }
}

