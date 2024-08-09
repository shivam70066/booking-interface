import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { AmenitiesFilterPipe } from '../../shared/pipes/amenities-filter.pipe';
import {
  AddToCartService,
  GetPriceModuleSelectedDatesV2Service,
  GetSearchResultSjService,
} from '../../../swagger/api/services';
import {
  AddToCartRequest,
  GetPriceModuleSelectedDatesResponse,
  GetSearchResultRequest,
  GetSearchResultResponse,
} from '../../../swagger/api/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgxSliderModule,
  Options,
  ChangeContext,
  PointerType,
} from '@angular-slider/ngx-slider';
import {
  NgbCalendar,
  NgbDate,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { HotelService } from '../../services/hotel-services.service';

@Component({
  selector: 'app-search-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDatepickerModule, NgxSliderModule, AmenitiesFilterPipe],
  templateUrl: './search-rooms.component.html',
  styleUrl: './search-rooms.component.scss',
})
export class SearchRoomsComponent implements OnInit {
  adultCount: number = 2;
  childCount: number = 0;
  sub_hotel_id: number = 123;
  room_stay_from: string = '';
  room_stay_to: string = '';
  subHotelsMinimumPrice: any = [];
  responseStatus: string = 'success';
  loading: boolean = true;
  results: any = [];
  selectedPlan: any = [];
  selectedPolicy: any = [];
  reservationInfo: any = {};
  mupog: string = '';
  totalCartItems: any;
  sortDirection: string = 'asc';
  bestPriceLoading: boolean = true;
  bestPriceData: GetPriceModuleSelectedDatesResponse | null = null;
  hotelId: number | undefined = 123;
  marinaSelected: boolean = false;
  isMinusIcon: boolean = false;
  isAmentiesIcon: boolean = false;
  fromDate: NgbDate;
  minDate?: NgbDate;
  nextDate: NgbDate;
  value: number = 0;
  highValue: number = 1500;
  options: Options = {
    floor: 0,
    ceil: 1500,
    step: 20,
  };
  oldResult: any;
  roomTypes: any = [];
  product_type: string = 'room';
  bed_code_name: string = '';
  amentiesTypes: any = [];
  filterationData: any = [];
  amenitiesCheck: any = [];
  priceFilterData: any = { low: this.value, high: this.highValue };
  filterDataCombined: any = {
    product_type: this.product_type,
    bed_code_name: this.bed_code_name
  };
  private hotelIDSubscription?: Subscription;
  // marinaSelected:boolean = false;
  // hotelIDSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private searchresult: GetSearchResultSjService,
    private hotelServie: HotelService,
    private priceModule: GetPriceModuleSelectedDatesV2Service,
    private calendar: NgbCalendar,
    private addToCartService: AddToCartService,
    private router: Router
  ) {
    this.commonService.setPagetitle('Results');
    this.fromDate = this.calendar.getToday();
    this.nextDate = this.calendar.getNext(this.fromDate, 'd', 1);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.sub_hotel_id = parseInt(params.get('hotel') || '123');
      this.room_stay_from = params.get('room_stay_from') || '';
      this.room_stay_to = params.get('room_stay_to') || '';
      this.adultCount = parseInt(params.get('adults') || '2');

      this.childCount = parseInt(params.get('child') || '0');
    });
    this.searchRooms();
    if (localStorage.getItem('mupog')) {
      this.mupog = localStorage.getItem('mupog') || '';
    }
    this.hotelIDSubscription = this.commonService.hotelId$.subscribe((id) => {
      this.hotelId = id;
    });
    this.getBestPrice(
      this.commonService.convertStringToNgbDate(this.room_stay_from),
      this.commonService.convertStringToNgbDate(this.room_stay_to)
    );
  }

  convertStringToNgbDate(date: string): NgbDate {
    return this.commonService.convertStringToNgbDate(date);
  }

  updateHotelFilter(id: number) {
    this.sub_hotel_id = id;
    this.searchRooms();
  }
  changeFilters() {
    if (this.bed_code_name === 'All' || this.bed_code_name === '') {
      this.results = this.oldResult;
    } else {
      this.results = this.oldResult.filter(
        (room: any) => room.bed_code_name === this.bed_code_name
      );
    }
  }
  onUserChange(context: ChangeContext): void {
    this.results = this.oldResult;
    if (context.pointerType === PointerType.Max) {
      if (context.highValue !== undefined) {
        this.highValue = context.highValue;
        this.changePriceFilter();
        this.results = this.results.filter((room: any) => {
          if (+room.minimum_price_value <= this.highValue) {
            return room;
          }
        });
      }
    } else if (context.pointerType === PointerType.Min) {
      this.value = context.value;
      this.changePriceFilter();
      this.results = this.results.filter((room: any) => {
        if (+room.minimum_price_value >= this.value) {
          return room;
        }
      });
    }
  }

  changePriceFilter() {
    this.priceFilterData = { low: this.value, high: this.highValue };
  }
  changeAmenitiesFilter() {
    this.filterationData = [];
    this.amenitiesCheck.forEach((value: boolean, key: string) => {
      if (value) {
        this.filterationData.push(this.amentiesTypes[key]['value']);
      }
    });
  }
  filterData(filterData: string) {
    var data = JSON.parse(JSON.stringify(this.filterationData));
    if (data.indexOf(filterData) == -1) {
      data.push(filterData);
    } else {
      let index = data.indexOf(filterData);
      data.splice(index, 1);
    }
    this.filterationData = JSON.parse(JSON.stringify(data));
  }
  searchRooms() {
    this.loading = true;
    const data: GetSearchResultRequest = {
      promo: '',
      room_stay_from: this.room_stay_from,
      room_stay_to: this.room_stay_to,
      sub_hotel_id: this.sub_hotel_id.toString(),
      type: 'room',
      adults: this.adultCount.toString(),
      child: this.childCount.toString(),
    };
    this.searchresult
      .frontendSearchresultsGetSearchResultsSjPost({ body: data })
      .subscribe({
        next: (resp: GetSearchResultResponse) => {
          this.subHotelsMinimumPrice = resp.data?.subHotelMinimumPrice;
          this.results = resp.data?.rooms_avail?.[0].available_rooms;
          this.oldResult = resp.data?.rooms_avail?.[0].available_rooms;
          this.loading = false;
          if (resp.data?.minimumnPrice != undefined) {
            this.highValue = resp.data.maximumPrice as number;
            const newOptions: Options = Object.assign({}, this.options);
            newOptions.ceil = this.highValue;
            this.options = newOptions;
          }
          this.roomTypes = resp.data?.bedType_for_filters;
          this.amentiesTypes = resp.data?.amenities_filters;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  addToCart(room: any, calledfrom: string) {
    this.loading = true;
    if (parseInt(room.mls_days) > 1) {
      let mlsDates = '';
      if (room.mls_dates_start_end) {
        mlsDates =
          'MLS is applicable from ' +
          room.mls_dates_start_end.startDate +
          ' to ' +
          room.mls_dates_start_end.endDate +
          '.';
      }
      return;
    }
    this.reservationInfo = {
      adults: this.adultCount,
      child: this.childCount,
      quantity: 1,
    };
    var mupog = localStorage.getItem('mupog');
    var selectedPolicy = 2;
    var selectedPlan = '';
    var roomIndex = this.results.indexOf(room);
    selectedPolicy = this.selectedPolicy[roomIndex];
    selectedPlan = this.selectedPlan[roomIndex];
    this.reservationInfo.room_stay_from = this.room_stay_from;
    this.reservationInfo.room_stay_to = this.room_stay_to;
    this.reservationInfo.addCharges =
      room.addCharges !== undefined ? room.addCharges : 0;
    this.reservationInfo.cart_type = 'reservation';
    this.reservationInfo.roomTypeName = room.room_type_name;
    this.reservationInfo.dates = [];
    this.reservationInfo.nightlydiscount = [];
    this.reservationInfo.ratePlan = [];
    this.reservationInfo.dates = room.dates[selectedPolicy][selectedPlan];
    this.reservationInfo.nightlySum =
      room.nightlySum[selectedPolicy][selectedPlan];
    if (room.nightlydiscount !== undefined) {
      this.reservationInfo.nightlydiscount =
        room.nightlydiscount[selectedPolicy][selectedPlan];
    } else {
      room.dates[selectedPolicy][selectedPlan].forEach(() => {
        this.reservationInfo.nightlydiscount.push('0.00');
      });
    }
    room.dates[selectedPolicy][selectedPlan].forEach(() => {
      this.reservationInfo.ratePlan.push(
        room.rateNameDesc[selectedPolicy][selectedPlan]['ratePlanName']
      );
    });
    this.reservationInfo.rates = room.rates[selectedPolicy][selectedPlan];
    this.reservationInfo.uniqueIndex = room.uniqueIndex;

    this.reservationInfo.room_display_name = room.room_display_name;
    this.reservationInfo.products_to_be_blocked = room.products_to_be_blocked;
    this.reservationInfo.typeId = room.type_id;
    this.reservationInfo.roomMove = false;
    this.reservationInfo.product_name = room.product_name;
    this.reservationInfo.selectedPolicyId = selectedPolicy;

    if (
      room.hasOwnProperty('totalDiscount') &&
      room.totalDiscount[selectedPolicy][selectedPlan] !== undefined &&
      room.totalDiscount[selectedPolicy][selectedPlan] !== 'undefined' &&
      room.totalDiscount[selectedPolicy][selectedPlan] !== null &&
      room.totalDiscount[selectedPolicy][selectedPlan] > 0
    ) {
      this.reservationInfo.product_discount = '';
      if (
        room.promotion_id !== undefined &&
        room.promotion_id !== 'undefined' &&
        room.promotion_id !== '' &&
        room.promotion_id !== null
      ) {
        this.reservationInfo.promo = '';
        this.reservationInfo.promotion_id = room.promotion_id;
      } else {
        this.reservationInfo.promo = '';
        this.reservationInfo.promotion_id = '';
      }
    } else {
      this.reservationInfo.product_discount = 0;
    }
    this.reservationInfo.productId = room.product_id;

    if (
      localStorage.getItem('mupog') !== undefined &&
      localStorage.getItem('mupog') !== 'undefined' &&
      localStorage.getItem('mupog') !== null
    ) {
      this.reservationInfo.mupog = this.mupog =
        localStorage.getItem('mupog') || '';
    } else {
      this.mupog = this.reservationInfo.mupog = '';
    }
    this.addToCartService.frontendCartAddToCartPost({body:this.reservationInfo}).subscribe((data:any) => {
      if(data.status == 'error'){
        alert(data.message);
      } else {
        var cartData = data.data.cart_data;
        var cartTotal = data.data.cart_total;
        var totalCartItems =  parseInt(data.data.cart_data[0].cart_items_count);
        this.mupog = cartData[0].mupog;
        localStorage.setItem('mupog',this.mupog);
        setTimeout (() => {
          this.commonService.updateCartData(totalCartItems);
          this.commonService.updateCartItems(cartData);
          this.commonService.updateCartItemsTotal(cartTotal);
        },100);
        this.commonService.addRoute(this.router.url.slice(1));
        this.router.navigate(['cart'],{
          skipLocationChange:true
        });
      }
      // this.loading= false;
      window.scroll({top: 0,left: 0,behavior: 'smooth'});

    });
  }

  changeSelectedPlanPolicy(index: number, policy: number, plan: string) {
    this.selectedPlan[index] = plan;
    this.selectedPolicy[index] = policy;
  }

  sortByValue(sortOrder: string) {
    this.results = [...this.results].sort((a, b) => {
      return sortOrder === 'asc'
        ? a.price_for_sorting - b.price_for_sorting
        : b.price_for_sorting - a.price_for_sorting;
    });
  }

  getBestPrice(startDate: NgbDate, endDate: NgbDate) {
    this.bestPriceLoading = true;
    var data = {
      calledFrom: 'header',
      calledOn: 'dateSelection',
      end: endDate,
      start: startDate,
      fromSuitesPage: false,
      promo: '',
      roomTypeId: 0,
      sub_hotel_id: 123,
    };

    this.priceModule
      .frontendSearchresultsGetPriceModuleSelectedDatesV2Post({ body: data })
      .subscribe({
        next: (response: GetPriceModuleSelectedDatesResponse) => {
          this.bestPriceData = response;
          this.bestPriceLoading = false;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
  toggleIcon() {
    this.isMinusIcon = !this.isMinusIcon;
  }
  toggleAmentiesIcon() {
    this.isAmentiesIcon = !this.isAmentiesIcon;
  }
  formatDate(date: NgbDate) {
    const year = date.year;
    const month = date.month < 10 ? '0' + date.month : date.month;
    const day = date.day < 10 ? '0' + date.day : date.day;
    return `${year}-${month}-${day}`;
  }
  onArrivalDateChange(event: any): void {
    const dateParts = event.target.value.split('-');
    this.minDate = new NgbDate(
      parseInt(dateParts[0], 10),
      parseInt(dateParts[1], 10),
      parseInt(dateParts[2], 10)
    );
    this.nextDate = this.calendar.getNext(this.minDate, 'd', 1);
  }
}
