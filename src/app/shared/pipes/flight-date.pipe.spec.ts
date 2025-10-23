import { FlightDatePipe } from './flight-date.pipe';

describe('FlightDatePipe', () => {
  it('create an instance', () => {
    const pipe = new FlightDatePipe();
    expect(pipe).toBeTruthy();
  });
});
