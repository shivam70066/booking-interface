import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { constVariables } from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { GetPriceModuleSelectedDatesV2Service, GetPriceMlsStopSellService } from '../../../swagger/api/services';
import { GetPriceMlsStopSellRequest, GetPriceModuleSelectedDatesResponse } from '../../../swagger/api/models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  adultsData = constVariables.AdultsData;
  kidsData = constVariables.KidsData;

  hotelId: number | undefined = 123;
  private hotelIDSubscription?: Subscription;

  calendar = inject(NgbCalendar);
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 1);
  adultCount: number = 2;
  childCount: number = 0;

  bestPriceLoading: boolean = true;
  bestPriceData: GetPriceModuleSelectedDatesResponse | null = null;
  priceModuleData: any = {};

  minDate: NgbDate = this.calendar.getToday();

  constructor(
    private commonService: CommonService,
    private router: Router,
    private priceModule: GetPriceModuleSelectedDatesV2Service,
    private priceMLSStopSellService: GetPriceMlsStopSellService

  ) {
    this.getBestPrice(this.minDate, this.minDate = this.calendar.getNext(this.minDate, 'd', 1));
    this.commonService.setPagetitle("Check Availability");
  }

  ngOnInit(): void {
    this.hotelIDSubscription = this.commonService.hotelId$.subscribe(id => {
      this.hotelId = id;
    })
  }

  changeHotel(hotelId: number) {
    this.commonService.setHotelId(hotelId)
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
    if (this.toDate != null && this.fromDate != null) {
      this.getBestPrice(this.fromDate, this.toDate);
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isDisabled(date: NgbDate) {

    return ((this.minDate.day - 1) > date.day && this.minDate.month >= date.month && this.minDate.year >= date.year);
  }

  isStopsell(date: NgbDate) {
    return false;
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

  onNavigate(event: NgbDatepickerNavigateEvent) {

    var fromDate = `${event.next.year}-${event.next.month}-01`;
    const nextMonthDate = new Date(event.next.year, event.next.month+1, 0);

    const lastDate = nextMonthDate.getDate();
    const toDate = `${nextMonthDate.getFullYear()}-${nextMonthDate.getMonth()+1}-${lastDate}`;
    this.getPriceMlsStopSells(fromDate,toDate);

  }

  getPriceMlsStopSells(fromDate: string, toDate: string) {
    this.priceModuleData = {};
    this.priceMLSStopSellService.frontendSearchresultsGetPriceMlsStopSellPost({
      body: {
        "first": fromDate,
        "last": toDate,
        "promo": "",
        "sub_hotel_id": 123,
        "fromSuitesPage": false
      }
    }).subscribe((resp => {
      this.priceModuleData = resp.amount;
    }))
  }

  getBestPrice(startDate: NgbDate, endDate: NgbDate) {
    this.bestPriceLoading = true;
    var data = {
      calledFrom: "header",
      calledOn: "dateSelection",
      end: endDate,
      start: startDate,
      fromSuitesPage: false,
      promo: "",
      roomTypeId: 0,
      sub_hotel_id: this.hotelId
    }

    this.priceModule.frontendSearchresultsGetPriceModuleSelectedDatesV2Post({ body: data }).subscribe({
      next: (response: GetPriceModuleSelectedDatesResponse) => {
        this.bestPriceData = response;
        this.bestPriceLoading = false;
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  searchRooms() {
    let data = {
      "promo": "",
      "room_stay_from": this.commonService.formatNgbDate(this.fromDate),
      "room_stay_to": this.commonService.formatNgbDate(this.toDate || this.calendar.getNext(this.fromDate, 'd', 1)),
      "sub_hotel_id": this.hotelId?.toString(),
      "adults": this.adultCount.toString(),
      "child": this.childCount.toString()
    }
    let path = `/search-room/${data.sub_hotel_id}/${data.room_stay_from}/${data.room_stay_to}/${data.adults}/${data.child}/${data.child}`;
    this.commonService.addRoute('calendar');
    this.router.navigate([path], {
      skipLocationChange: true,
    });
  }


  ngOnDestroy(): void {
    this.hotelIDSubscription?.unsubscribe();
  }
}
