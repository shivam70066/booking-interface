import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CommonService } from '../../services/common/common.service';


interface Properties {
  img: String
  main_heading : String
  sub_heading: String
  id: number
}

@Component({
  selector: 'app-display-properties',
  standalone: true,
  imports: [],
  templateUrl: './display-properties.component.html',
  styleUrl: './display-properties.component.scss'
})
export class DisplayPropertiesComponent {
  constructor(public router : Router, private commonService: CommonService){
  }

  properties : Properties[] = [
    {
      img : "r1.jpg",
      main_heading: 'Plaza Beach BeachFront',
      sub_heading: "Hotel And Resort",
      id: 123
    },
    {
      img : "r2.jpg",
      main_heading: "BayView Plaza WaterFront",
      sub_heading: "Hotel And Resort",
      id: 124
    },
    {
      img : "r3.jpg",
      main_heading: "Bay Palms WaterFront",
      sub_heading: "Hotel And Marina",
      id: 125
    }
  ]
  goToCalendar(id:number){
    this.commonService.setHotelId(id);
    this.router.navigate(['/calendar'],{
      skipLocationChange: true,
    });

  }
}
