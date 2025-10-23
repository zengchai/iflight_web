export interface Flight {
  id: number;
  flightNumber: string;
  airline: string;
  destination: string;
  gate: string;
  departureTime: string;
  status: FlightStatus;
}

export enum FlightStatus {
  SCHEDULED = 'SCHEDULED',
  ON_TIME = 'ON_TIME',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
  LANDED = 'LANDED'
}
