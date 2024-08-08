import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private http = inject(HttpClient);
  constructor() { }

  getRooms(data:any) {
    return this.http.post('https://www.plazabeachresorts.com/ls-api/frontend/Searchresults/get_search_results_sj', data);
  }
  addTocart(data:any){
    return this.http.post('https://www.plazabeachresorts.com/ls-api/frontend/cart/add_to_cart',data);
  }
  deleteCart(data:any){
    return this.http.post('http://localhost/ls/ls-api/frontend/cart/delete_cart',data);
  }
  deleteCartItem(data:any){
    return this.http.post('http://localhost/ls/ls-api/frontend/cart/delete_cart_item', data)
  }

}
