import { Routes } from '@angular/router';

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
];