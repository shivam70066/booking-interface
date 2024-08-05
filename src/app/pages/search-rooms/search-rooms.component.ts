import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { GetSearchResultSjService } from '../../../swagger/api/services';
import { GetSearchResultRequest, GetSearchResultResponse } from '../../../swagger/api/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-rooms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-rooms.component.html',
  styleUrl: './search-rooms.component.scss'
})
export class SearchRoomsComponent implements OnInit {
  adultCount: string = "2";
  childCount: string = "0";
  sub_hotel_id: number = 123;
  room_stay_from: string = "";
  room_stay_to: string = "";
  subHotelsMinimumPrice:any = [];
  responseStatus:string = "success";
  loading:boolean = true;
  results: any = [];

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private searchresult: GetSearchResultSjService,
  ) {
    this.commonService.setPagetitle("Results");
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sub_hotel_id = parseInt(params.get("hotel") || "123") ;
      this.room_stay_from = params.get("room_stay_from") || "";
      this.room_stay_to = params.get('room_stay_to') || "";
      this.adultCount = params.get('adults') || "2";
      this.childCount = params.get('child') || "0";
    });
    this.searchRooms()
  }

  updateHotelFilter(id: number  ){
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
        this.loading=false;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  changeSelectedPlanPolicy(one:any, two:any, three:any){
console.log(one)
console.log(two)

console.log(three)

  }
}
