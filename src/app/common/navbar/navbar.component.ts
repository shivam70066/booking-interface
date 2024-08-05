import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  titleSubscription? : Subscription;
  routeSubscription? : Subscription;
  routeStack:Array<string> = [];

  pageTitle : string = "";
  constructor(private commonService : CommonService, private router: Router){
    this.titleSubscription = commonService.pageTitle$.subscribe((title)=>{
      this.pageTitle = title;
    })
    this.routeSubscription = this.commonService.routeStack$.subscribe((routes)=>{
      this.routeStack=routes;
    })
  }


  toggleInterface(state: boolean){
    this.commonService.setInterfaceStatus(state);
  }

  getLastRoute(){
    const lastRoute = this.commonService.getLastRoute();
    this.router.navigate([lastRoute]);
  }

  ngOnDestroy(): void {
    this.commonService.clearRoutes();
    this.routeSubscription?.unsubscribe();
  }
}
