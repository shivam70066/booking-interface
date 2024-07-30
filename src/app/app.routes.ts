import { Routes } from '@angular/router';
import { DisplayPropertiesComponent } from './components/display-properties/display-properties.component';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
  {
    path: 'properties' , component: DisplayPropertiesComponent
  },
  {
    path: 'calendar' , component: CalendarComponent
  }
];
