import { Injectable } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  private hotelIdSubject = new BehaviorSubject<number | null>(null);

  hotelId$ = this.hotelIdSubject.asObservable();

  setHotelId(id: number): void {
    this.hotelIdSubject.next(id);
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

