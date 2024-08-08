import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { AddToCartService, GetPriceModuleSelectedDatesV2Service, GetSearchResultSjService } from '../../../swagger/api/services';
import { AddToCartRequest, GetPriceModuleSelectedDatesResponse, GetSearchResultRequest, GetSearchResultResponse } from '../../../swagger/api/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-rooms.component.html',
  styleUrl: './search-rooms.component.scss'
})
export class SearchRoomsComponent implements OnInit {
  adultCount: string = "2";
  childCount: string = "0";
  sub_hotel_id: number = 123;
  room_stay_from: string = "";
  room_stay_to: string = "";
  subHotelsMinimumPrice: any = [];
  responseStatus: string = "success";
  loading: boolean = true;
  results: any = [];
  selectedPlan: any = [];
  selectedPolicy: any = [];
  reservationInfo: any = {};
  mupog: string = '';
  totalCartItems : any;
  sortDirection:string= "asc";
  bestPriceLoading : boolean = true;
  bestPriceData: GetPriceModuleSelectedDatesResponse | null = null;
  hotelId: number | undefined = 123;
  marinaSelected:boolean = false;
  hotelIDSubscription?: Subscription;


  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private searchresult: GetSearchResultSjService,
    private addToCartService: AddToCartService,
    private priceModule: GetPriceModuleSelectedDatesV2Service,
    private router: Router
  ) {
    this.commonService.setPagetitle("Results");
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sub_hotel_id = parseInt(params.get("hotel") || "123");
      this.room_stay_from = params.get("room_stay_from") || "";
      this.room_stay_to = params.get('room_stay_to') || "";
      this.adultCount = params.get('adults') || "2";
      this.childCount = params.get('child') || "0";
    });
    this.searchRooms();
    console.log(this.room_stay_from)

    if (localStorage.getItem('mupog')) {
      this.mupog = localStorage.getItem('mupog') || '';
    }
    this.hotelIDSubscription = this.commonService.hotelId$.subscribe(id => {
      this.hotelId = id;
    })
    this.getBestPrice(this.commonService.convertStringToNgbDate(this.room_stay_from),this.commonService.convertStringToNgbDate(this.room_stay_to));
  }

  updateHotelFilter(id: number) {
    this.sub_hotel_id = id;
    this.searchRooms();
  }

  searchRooms() {
    this.loading = true;
    const data: GetSearchResultRequest = {
      promo: "",
      room_stay_from: this.room_stay_from,
      room_stay_to: this.room_stay_to,
      sub_hotel_id: this.sub_hotel_id.toString(),
      type: "room",
      adults: this.adultCount,
      child: this.childCount
    }
    this.searchresult.frontendSearchresultsGetSearchResultsSjPost({ body: data }).subscribe({
      next: (resp: GetSearchResultResponse) => {
        this.subHotelsMinimumPrice = resp.data?.subHotelMinimumPrice;
        this.results = resp.data?.rooms_avail?.[0].available_rooms;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }


  addToCart(room: any, calledfrom: string) {
    this.loading = true;
    if (parseInt(room.mls_days) > 1) {
      let mlsDates = '';
      if (room.mls_dates_start_end) {
        mlsDates = 'MLS is applicable from ' + room.mls_dates_start_end.startDate + ' to ' + room.mls_dates_start_end.endDate + '.';
      }
      console.log(`Your stay must include ${parseInt(room.mls_days)} nights.`);
      return;
    }
    this.reservationInfo = {
      'adults'     : this.adultCount,
      'child'      : this.childCount,
      'quantity'     : 1
    };
    var mupog = localStorage.getItem('mupog');
    var selectedPolicy = 2;
    var selectedPlan = '';
    var roomIndex = this.results.indexOf(room);
    selectedPolicy = this.selectedPolicy[roomIndex];
    selectedPlan = this.selectedPlan[roomIndex];
    console.log(selectedPlan);
    console.log(selectedPolicy);
    this.reservationInfo.room_stay_from = this.room_stay_from;
    this.reservationInfo.room_stay_to = this.room_stay_to;
    console.log(this.reservationInfo)
    this.reservationInfo.addCharges = (room.addCharges !== undefined) ? room.addCharges : 0;
    this.reservationInfo.cart_type = 'reservation';
    this.reservationInfo.roomTypeName = room.room_type_name;
    this.reservationInfo.dates = [];
    this.reservationInfo.nightlydiscount = [];
    this.reservationInfo.ratePlan = [];
    this.reservationInfo.dates = room.dates[selectedPolicy][selectedPlan];
    this.reservationInfo.nightlySum = room.nightlySum[selectedPolicy][selectedPlan];
    if (room.nightlydiscount !== undefined) {
      this.reservationInfo.nightlydiscount = room.nightlydiscount[selectedPolicy][selectedPlan];
    } else {
      room.dates[selectedPolicy][selectedPlan].forEach(() => {
        this.reservationInfo.nightlydiscount.push('0.00');
      });
    }
    room.dates[selectedPolicy][selectedPlan].forEach(() => {
      this.reservationInfo.ratePlan.push(room.rateNameDesc[selectedPolicy][selectedPlan]['ratePlanName']);
    });
    this.reservationInfo.rates = room.rates[selectedPolicy][selectedPlan];
    this.reservationInfo.uniqueIndex = room.uniqueIndex;

    this.reservationInfo.room_display_name = room.room_display_name;
    this.reservationInfo.products_to_be_blocked = room.products_to_be_blocked;
    this.reservationInfo.typeId = room.type_id;
    this.reservationInfo.roomMove = false;
    this.reservationInfo.product_name = room.product_name;
    this.reservationInfo.selectedPolicyId = selectedPolicy;

    if (room.hasOwnProperty('totalDiscount') && room.totalDiscount[selectedPolicy][selectedPlan] !== undefined && room.totalDiscount[selectedPolicy][selectedPlan] !== 'undefined' && room.totalDiscount[selectedPolicy][selectedPlan] !== null && room.totalDiscount[selectedPolicy][selectedPlan] > 0) {
      this.reservationInfo.product_discount = '';
      if (room.promotion_id !== undefined && room.promotion_id !== 'undefined' && room.promotion_id !== '' && room.promotion_id !== null) {
        this.reservationInfo.promo = "";
        this.reservationInfo.promotion_id = room.promotion_id;
      } else {
        this.reservationInfo.promo = '';
        this.reservationInfo.promotion_id = '';
      }
    } else {
      this.reservationInfo.product_discount = 0;
    }
    this.reservationInfo.productId = room.product_id;

    if (localStorage.getItem('mupog') !== undefined && localStorage.getItem('mupog') !== 'undefined' &&localStorage.getItem('mupog') !== null  ) {
      this.reservationInfo.mupog = this.mupog = localStorage.getItem('mupog') || "" ;
    } else {
      this.mupog = this.reservationInfo.mupog = '';
    }
    this.addToCartService.frontendCartAddToCartPost({body:this.reservationInfo}).subscribe((data:any) => {
      if(data.status == 'error'){
        console.log(data.message);
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
        this.router.navigate(['cart'],{
          skipLocationChange:true
        });
        this.loading= false;
      }
      window.scroll({top: 0,left: 0,behavior: 'smooth'});

    });
  }

  changeSelectedPlanPolicy(index: number, policy: number, plan: string) {
    this.selectedPlan[index] = plan;
    this.selectedPolicy[index] = policy;
  }

  sortByValue(sortOrder: string) {
    this.results = [...this.results].sort((a, b) => {
      return sortOrder === 'asc' ? a.price_for_sorting - b.price_for_sorting : b.price_for_sorting - a.price_for_sorting;
    });
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
      sub_hotel_id: 123
    }

    this.priceModule.frontendSearchresultsGetPriceModuleSelectedDatesV2Post({ body: data }).subscribe({
      next: (response: GetPriceModuleSelectedDatesResponse) => {
        this.bestPriceData = response;
        this.bestPriceLoading = false;
      },
      error: (error:any) => {
        console.log(error);
      },
    })
  }
}
