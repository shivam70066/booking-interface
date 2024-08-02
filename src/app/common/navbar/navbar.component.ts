import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  titleSubscription? : Subscription;
  pageTitle : string = "";
  constructor(private commonService : CommonService){
    this.titleSubscription = commonService.pageTitle$.subscribe((title)=>{
      this.pageTitle = title;
    })
  }

  toggleInterface(state: boolean){
    this.commonService.setInterfaceStatus(state);
  }
}
