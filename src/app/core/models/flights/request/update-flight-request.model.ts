import { FlightStatus } from "../flight.model";

export interface UpdateFlightRequest {
    status: FlightStatus;
    gate: string;
    departureTime: string;
}