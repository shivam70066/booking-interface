import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {FormControl,FormsModule,ReactiveFormsModule,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { HotelService } from '../../services/hotel-services.service';
import { Router } from '@angular/router';
import {constVariables} from '../../constants/constants'
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  adultsData = constVariables.AdultsData;
  kidsData = constVariables.KidsData;

  hotelId: number | null = null;
  private subscription: Subscription = new Subscription();
  calendar = inject(NgbCalendar);
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 1);

  constructor(private commonService: CommonService, private hotelService: HotelService, private router: Router) { }

  ngOnInit(): void {
    this.subscription.add(
      this.commonService.hotelId$.subscribe(id => {
        this.hotelId = id;
      })
    );
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  Adults = new FormControl(2);
  Kids = new FormControl(0);
  getRooms() {
    let data = {
      "promo": "",
      "room_stay_from": this.commonService.formatNgbDate(this.fromDate),
      "room_stay_to": this.commonService.formatNgbDate(this.toDate || this.calendar.getNext(this.fromDate, 'd', 1)),
      "sub_hotel_id": this.hotelId?.toString(),
      "adults": this.Adults.value?.toString(),
      "child": this.Kids.value?.toString()
    }
    let path = `/search-room/${data.sub_hotel_id}/${data.room_stay_from}/${data.room_stay_to}/${data.adults}/${data.child}/${data.child}`;
    this.router.navigate([path], {
      skipLocationChange: true,
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
