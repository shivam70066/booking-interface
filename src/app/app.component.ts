import { Component , ElementRef, ViewEncapsulation} from '@angular/core';
import { RouterOutlet,RouterLink, Router } from '@angular/router';
import {OverlayModule} from '@angular/cdk/overlay';

@Component({
  selector: 'bedy-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, OverlayModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent {
  title = 'booking-interface';
  showBookButton : boolean = true;
  isOpen = false;

  constructor(
    private el: ElementRef,
    private router: Router
  ){
    console.log(this.el.nativeElement.getAttribute("privateKey") )

    this.router.navigate(['hotels-properties'], {
      skipLocationChange: true
    })
  }

}

