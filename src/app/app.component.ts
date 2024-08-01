import { Component , ElementRef, ViewEncapsulation} from '@angular/core';
import { RouterOutlet,RouterLink, Router } from '@angular/router';
import {OverlayModule} from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { CommonService } from './services/common.service';
import { GlobalButtonComponent } from "./global/global-button/global-button.component";

@Component({
  selector: 'bedy-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, OverlayModule, GlobalButtonComponent],
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

  toggleInterface(state: boolean){
    this.commonService.setInterfaceStatus(state);
  }

  ngOnDestroy(): void {
    this.interfaceState?.unsubscribe();
  }
}

