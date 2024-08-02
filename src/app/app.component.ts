import { Component , ElementRef, ViewEncapsulation} from '@angular/core';
import { RouterOutlet,RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from './services/common.service';
import { GlobalButtonComponent } from "./common/global-button/global-button.component";
import { NavbarComponent } from "./common/navbar/navbar.component";

@Component({
  selector: 'bedy-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, GlobalButtonComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent {
  title = 'booking-interface';
  showPopUp : boolean = false;
  interfaceState? : Subscription;

  constructor(
    private el: ElementRef,
    private router: Router,
    private commonService : CommonService
  ){
    console.log(this.el.nativeElement.getAttribute("privateKey") )
    this.interfaceState = this.commonService.showInterface$.subscribe((popUpState:boolean)=>{
      this.showPopUp = popUpState;
    })

  }

  ngOnDestroy(): void {
    this.interfaceState?.unsubscribe();
  }
}

