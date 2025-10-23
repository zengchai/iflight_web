import { Pipe, PipeTransform } from '@angular/core';
import { FlightStatus } from '../../core/models/flights/flight.model';

@Pipe({
  name: 'flightStatus',
})
export class FlightStatusPipe implements PipeTransform {
  transform(status: FlightStatus): string {
    const statusDisplayMap: { [key in FlightStatus]: string } = {
      [FlightStatus.SCHEDULED]: 'Scheduled',
      [FlightStatus.ON_TIME]: 'On Time',
      [FlightStatus.DELAYED]: 'Delayed',
      [FlightStatus.CANCELLED]: 'Cancelled',
      [FlightStatus.LANDED]: 'Landed',
    };
    return statusDisplayMap[status] || status;
  }
}
