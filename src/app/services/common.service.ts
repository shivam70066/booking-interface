import { Injectable } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  private hotelIdSubject = new BehaviorSubject<number>(0);
  hotelId$ = this.hotelIdSubject.asObservable();

  private showInterface = new BehaviorSubject<boolean>(false);
  showInterface$ = this.showInterface.asObservable();

  private pageTitle = new BehaviorSubject<string>("");
  pageTitle$ = this.pageTitle.asObservable();

  private routeStackSubject = new BehaviorSubject<string[]>([]);
  routeStack$ = this.routeStackSubject.asObservable();

  public cartItems = new BehaviorSubject({});
  private CartItemsTotal = new BehaviorSubject({});
  private cartCount = new BehaviorSubject(0);
  checkcartItems = this.cartItems.asObservable();
  totalCartCount = this.cartCount.asObservable();
  checkcartItemsTotal = this.CartItemsTotal.asObservable();

  updateCartData(cartCount: number) {
    this.cartCount.next(cartCount);
  }

  updateCartItems(cartItems: any) {
    console.log(cartItems)
    this.cartItems.next(cartItems);
  }

  updateCartItemsTotal(CartItemsTotal: any) {
    this.CartItemsTotal.next(CartItemsTotal);
  }

  addRoute(route: string): void {
    const currentStack = this.routeStackSubject.getValue();
    this.routeStackSubject.next([...currentStack, route]);
  }

  getLastRoute() {
    const currentStack = this.routeStackSubject.getValue();
    const lastRoute = currentStack.pop();
    this.routeStackSubject.next([...currentStack]);
    return lastRoute;
  }

  clearRoutes(): void {
    this.routeStackSubject.next([]);
  }


  setHotelId(id: number): void {
    this.hotelIdSubject.next(id);
  }

  setPagetitle(title: string) {
    this.pageTitle.next(title);
  }

  setInterfaceStatus(state: boolean) {
    this.showInterface.next(state);
  }

  formatNgbDate(date: NgbDate): string {
    if (date) {
      const month = date.month < 10 ? `0${date.month}` : `${date.month}`;
      const day = date.day < 10 ? `0${date.day}` : `${date.day}`;
      return `${month}-${day}-${date.year}`;
    }
    return '';
  }

  convertStringToNgbDate(dateString: string): NgbDate {
    const [month, day, year] = dateString.split('-').map(Number);
    return new NgbDate(year, month, day);
  }


  getNextMonth(date: NgbDate): NgbDate {
    let year = date.year;
    let month = date.month + 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    return new NgbDate(year, month, 1);
  }

}

