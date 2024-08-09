import { CartComponent } from './common/cart/cart.component';
import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'hotels-properties',
    loadComponent: () => import('./pages/hotel-properties/hotel-properties.component').then(m => m.HotelPropertiesComponent)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar/calendar.component').then(m => m.CalendarComponent)
  },
  {
    path: 'search-room/:hotel/:room_stay_from/:room_stay_to/:adults/:child/:promo',
    loadComponent: () => import('./pages/search-rooms/search-rooms.component').then(m => m.SearchRoomsComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./common/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'success',
    loadComponent: () => import('./pages/thankyou-component/thankyou-component.component').then(m => m.ThankyouComponentComponent)
  }
];
