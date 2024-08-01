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
}
