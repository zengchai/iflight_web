import { FlightStatus } from "../flight.model";

export interface FlightSearchRequest {
  flightNumber?: string;
  airline?: string;
  status?: FlightStatus;
}