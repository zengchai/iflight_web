import { Routes } from '@angular/router';
import { FlightListComponent } from './features/flights/components/flight-list/flight-list.component';
import { FlightFormComponent } from './features/flights/components/flight-form/flight-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/flights', pathMatch: 'full' }, // Default to flights
  { path: 'flights', component: FlightListComponent },
  { path: 'flights/create', component: FlightFormComponent },
  { path: 'flights/:id/:action', component: FlightFormComponent },
  { path: 'flights/:id', component: FlightFormComponent }
];
