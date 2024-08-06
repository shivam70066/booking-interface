import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoadCartDataService } from '../../../swagger/api/services';
import { LoadCartDataRequest, LoadCartDataResponse } from '../../../swagger/api/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  titleSubscription?: Subscription;
  routeSubscription?: Subscription;
  routeStack: Array<string> = [];

  cartItemsCount: any = 0;
  cartSubscription?: Subscription;

  pageTitle: string = "";
  constructor(private commonService: CommonService,
    private router: Router,
    private loadCartData: LoadCartDataService
  ) {
    if (localStorage.getItem('mupog')) {
      var mupog = localStorage.getItem('mupog') || "";
      this.loadCartData.frontendCartLoadCartDataPost({ body: { mupog: mupog } }).subscribe((resp: LoadCartDataResponse) => {
        if (resp?.data?.cart_data) {
          const keys = Object.keys(resp.data.cart_data);
          var itemsCount = parseInt(resp.data.cart_data?.[keys[0]][0]?.cart_items_count || "0");
          this.commonService.updateCartData(itemsCount);
        }
        else{
          this.commonService.updateCartData(0);
        }
      })
    }
    else{
      this.commonService.updateCartData(0);
    }
    this.cartSubscription = this.commonService.totalCartCount.subscribe((resp) => {
      this.cartItemsCount = resp;
    })
    this.titleSubscription = commonService.pageTitle$.subscribe((title) => {
      this.pageTitle = title;
    })
    this.routeSubscription = this.commonService.routeStack$.subscribe((routes) => {
      this.routeStack = routes;
    })
  }


  toggleInterface(state: boolean) {
    this.commonService.setInterfaceStatus(state);
  }

  getLastRoute() {
    const lastRoute = this.commonService.getLastRoute();
    this.router.navigate([lastRoute], {
      skipLocationChange: true
    });
  }

  goToCart() {
    if (this.cartItemsCount) {
      this.router.navigate(['cart'], {
        skipLocationChange: true
      });
    }
    else {
      this.router.navigate(['calendar'], {
        skipLocationChange: true
      })
    }
  }

  ngOnDestroy(): void {
    this.titleSubscription?.unsubscribe();
    this.commonService.clearRoutes();
    this.routeSubscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();

  }
}
