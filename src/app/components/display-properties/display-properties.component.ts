import { Component } from '@angular/core';


interface Properties {
  img: String
  main_heading : String
  sub_heading: String
}

@Component({
  selector: 'app-display-properties',
  standalone: true,
  imports: [],
  templateUrl: './display-properties.component.html',
  styleUrl: './display-properties.component.scss'
})
export class DisplayPropertiesComponent {
  constructor(){
  }

  properties : Properties[] = [
    {
      img : "r1.jpg",
      main_heading: 'Plaza Beach BeachFront',
      sub_heading: "Hotel And Resort"
    },
    {
      img : "r2.jpg",
      main_heading: "BayView Plaza WaterFront",
      sub_heading: "Hotel And Resort"
    },
    {
      img : "r3.jpg",
      main_heading: "Bay Palms WaterFront",
      sub_heading: "Hotel And Marina"
    }
  ]

}
