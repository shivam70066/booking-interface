import { Routes } from '@angular/router';
// import { DisplayPropertiesComponent } from './components/display-properties/display-properties.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SearchRoomsComponent } from './components/search-rooms/search-rooms.component';

export const routes: Routes = [
  {
    path: 'hotels-properties',
    loadComponent: () => import('./pages/hotel-properties/hotel-properties.component').then(m => m.HotelPropertiesComponent)
  },
  {
    path: 'search-availability',
    loadComponent: () => import('./pages/search-availability/search-availability.component').then(m => m.SearchAvailabilityComponent)
  },
  {
    path: 'show-rooms',
    loadComponent: () => import('./pages/show-rooms/show-rooms.component').then(m => m.ShowRoomsComponent)
  },
  {
    path: 'calendar' , component: CalendarComponent
  },
  {
    path: 'show-room/:hotel/:room_stay_from/:room_stay_to/:adults/:child/:promo', component: SearchRoomsComponent,
  }
];
