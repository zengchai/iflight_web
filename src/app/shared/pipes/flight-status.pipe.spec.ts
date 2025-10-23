import { FlightStatusPipe } from './flight-status.pipe';

describe('FlightStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new FlightStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
