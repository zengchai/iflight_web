import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PageResponse } from '../models/page.model';
import { Flight } from '../models/flights/flight.model';
import { ApiResponse } from '../models/api-response.model';
import { FlightSearchRequest } from '../models/flights/request/flight-search-request.model';
import { CreateFlightRequest } from '../models/flights/request/create-flight-request.model';
import { UpdateFlightRequest } from '../models/flights/request/update-flight-request.model';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private baseUrl = `${environment.apiBaseUrl}/flights`;

  constructor(private http: HttpClient) {}

  getAllFlights(
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<Flight>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<PageResponse<Flight>>>(`${this.baseUrl}/getall`, {
        params,
      })
      .pipe(
        map((response) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to fetch flights');
          }
        })
      );
  }

  searchFlights(
    criteria: FlightSearchRequest,
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<Flight>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Add search criteria as params
    Object.keys(criteria).forEach((key) => {
      const value = criteria[key as keyof FlightSearchRequest];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http
      .get<ApiResponse<PageResponse<Flight>>>(`${this.baseUrl}/search`, {
        params,
      })
      .pipe(
        map((response) => {
          if (response.success) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to fetch flights');
          }
        })
      );
  }

  createFlight(flightData: CreateFlightRequest): Observable<Flight> {
    return this.http.post<Flight>(`${this.baseUrl}/create`, flightData);
  }

  updateFlight(
    id: number,
    updates: Partial<UpdateFlightRequest>
  ): Observable<Flight> {
    return this.http.patch<Flight>(`${this.baseUrl}/update/${id}`, updates);
  }

  deleteFlight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getFlightById(id: number): Observable<Flight> {
    return this.http.get<ApiResponse<Flight>>(`${this.baseUrl}/get/${id}`).pipe(
      map((response) => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch flight');
        }
      })
    );
  }
}
