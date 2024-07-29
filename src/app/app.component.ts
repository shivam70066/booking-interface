import { Component } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'booking-interface';
  showBookButton : boolean = true;

  constructor(){

  }

  hello(){
    console.log('hello');
  }

  toggleBookingInterface(){
    this.showBookButton = !this.showBookButton;

  }
}
