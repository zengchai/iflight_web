import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flightDate',
})
export class FlightDatePipe implements PipeTransform {
  transform(dateString: string, format: string = 'medium'): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);

      switch (format) {
        case 'short':
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        case 'time':
          return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });
        case 'date':
          return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
        case 'medium':
        default:
          return date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
      }
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  }
}
