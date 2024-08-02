import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from '../../services/hotel-services.service';
import { GetPriceModuleSelectedDatesV2Service } from '../../../swagger/api/services';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-search-rooms',
  standalone: true,
  imports: [],
  templateUrl: './search-rooms.component.html',
  styleUrl: './search-rooms.component.scss'
})
export class SearchRoomsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private commonService: CommonService,
    private apiService: GetPriceModuleSelectedDatesV2Service
  ) {
    this.commonService.setPagetitle("Results");
  }

  ngOnInit(): void {
    // Subscribe to route parameters
    var data = {};
    this.route.paramMap.subscribe(params => {
      data = {
        "promo": "",
        "room_stay_from": params.get('room_stay_from'),
        "room_stay_to": params.get('room_stay_to'),
        "sub_hotel_id": params.get('hotel'),
        "type": "room",
        "adults": params.get('adults'),
        "child": params.get('child')
      }
    });
    this.hotelService.getRooms(data).subscribe({
      next: (resp: any) => {
        console.log(resp);
      }
    });
  }
}
