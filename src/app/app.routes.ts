import { Routes } from '@angular/router';
import { DisplayPropertiesComponent } from './components/display-properties/display-properties.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SearchRoomsComponent } from './components/search-rooms/search-rooms.component';

export const routes: Routes = [
  {
    path: 'properties' , component: DisplayPropertiesComponent
  },
  {
    path: 'calendar' , component: CalendarComponent
  },
  {
    path: 'show-room/:hotel/:room_stay_from/:room_stay_to/:adults/:child/:promo', component: SearchRoomsComponent,
  }
];
