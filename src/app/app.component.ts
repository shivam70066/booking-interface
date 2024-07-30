import { Component , ViewEncapsulation} from '@angular/core';
import { RouterOutlet,RouterLink, Router } from '@angular/router';
import {OverlayModule} from '@angular/cdk/overlay';
import { DisplayPropertiesComponent } from "./components/display-properties/display-properties.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, OverlayModule, DisplayPropertiesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'booking-interface';
  showBookButton : boolean = true;
  isOpen = false;

  constructor(private router: Router){

  }

  openOverlay(){
    this.isOpen = !this.isOpen;
    this.router.navigate(['/properties']);
  }

  closeOverlay(){
    this.isOpen = false;
    this.router.navigate(['/']);
  }
}

