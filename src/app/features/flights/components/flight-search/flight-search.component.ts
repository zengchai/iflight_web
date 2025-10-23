import { Component, EventEmitter, Output } from '@angular/core';
import { FlightStatus } from '../../../../core/models/flights/flight.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.scss'
})
export class FlightSearchComponent {
  @Output() search = new EventEmitter<any>();
  @Output() clear = new EventEmitter<void>();

  searchCriteria = {
    flightNumber: '',
    airline: '',
    status: '' as FlightStatus | ''
  };

  statusOptions = [
    { value: '', display: 'All Statuses' },
    { value: FlightStatus.SCHEDULED, display: 'Scheduled' },
    { value: FlightStatus.ON_TIME, display: 'On Time' },
    { value: FlightStatus.DELAYED, display: 'Delayed' },
    { value: FlightStatus.CANCELLED, display: 'Cancelled' },
    { value: FlightStatus.LANDED, display: 'Landed' }
  ];

  onSearch(): void {
    const cleanCriteria = Object.fromEntries(
      Object.entries(this.searchCriteria).filter(([_, value]) => value !== '')
    );
    console.log('Emitting search with criteria:', cleanCriteria);
    this.search.emit(cleanCriteria);
  }

  onClear(): void {
    this.searchCriteria = { flightNumber: '', airline: '', status: '' };
    this.clear.emit();
  }
}
