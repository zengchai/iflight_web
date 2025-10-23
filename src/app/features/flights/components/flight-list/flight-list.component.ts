import { Component, OnInit } from '@angular/core';
import { Flight } from '../../../../core/models/flights/flight.model';
import { PageResponse } from '../../../../core/models/page.model';
import { FlightService } from '../../../../core/services/flight.service';
import { FlightStatusPipe } from '../../../../shared/pipes/flight-status.pipe';
import { FlightDatePipe } from '../../../../shared/pipes/flight-date.pipe';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FlightSearchComponent } from '../flight-search/flight-search.component';
import { FormsModule } from '@angular/forms';
import { ErrorToastComponent } from '../../../../shared/components/error/error-toast/error-toast.component';

@Component({
  selector: 'app-flight-list',
  imports: [
    FormsModule,
    FlightSearchComponent,
    RouterLink,
    CommonModule,
    FlightStatusPipe,
    FlightDatePipe,
    ErrorToastComponent,
  ],
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.scss',
})
export class FlightListComponent implements OnInit {
  flights: Flight[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isLoading = false;
  currentSearchCriteria: any = {};
  showConfirmationDeleteDialog = false;
  flightToDelete?: number;
  errorMessage = '';
  showError = false;
  successMessage = '';
  showSuccess = false;

  constructor(private flightService: FlightService, private router: Router) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights(): void {
    this.isLoading = true;
    this.flightService
      .getAllFlights(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: PageResponse<Flight>) => {
          this.flights = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          this.showErrorMsg(error.error.message || 'Failed to load flights');
          this.isLoading = false;
        },
      });
  }

  onSearch(criteria: any): void {
    this.currentSearchCriteria = criteria;
    this.currentPage = 0;
    this.isLoading = true;

    this.flightService
      .searchFlights(criteria, this.currentPage, this.pageSize)
      .subscribe({
        next: (response: PageResponse<Flight>) => {
          this.flights = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          this.showErrorMsg(error.error.message || 'Search failed');
          this.isLoading = false;
        },
      });
  }

  onClearSearch(): void {
    this.currentSearchCriteria = {};
    this.currentPage = 0;
    this.loadFlights();
  }

  onPageChange(page: number): void {
    this.currentPage = page;

    if (Object.keys(this.currentSearchCriteria).length > 0) {
      this.flightService
        .searchFlights(
          this.currentSearchCriteria,
          this.currentPage,
          this.pageSize
        )
        .subscribe({
          next: (response: PageResponse<Flight>) => {
            this.flights = response.content;
            this.totalElements = response.totalElements;
            this.totalPages = response.totalPages;
          },
          error: (error) => {
            this.showErrorMsg(error.error.message || 'Page change failed');
          },
        });
    } else {
      this.loadFlights();
    }
  }

  navigateToCreate(): void {
    this.router.navigate(['/flights/create']);
  }

  get hasActiveSearch(): boolean {
    return Object.keys(this.currentSearchCriteria).length > 0;
  }
  private showErrorMsg(message: string): void {
    this.errorMessage = message;
    this.showError = true;
  }

  onErrorDismissed(): void {
    this.showError = false;
    this.errorMessage = '';
  }

  private showSuccessMsg(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
  }

  onSuccessDismissed(): void {
    this.showSuccess = false;
    this.successMessage = '';
  }

  confirmDelete(flightId: number): void {
    this.isLoading = true;
    this.flightService.deleteFlight(flightId).subscribe({
      next: () => {
        this.isLoading = false;
        this.showConfirmationDeleteDialog = false;
        this.flightToDelete = undefined;
        this.loadFlights();
        this.showSuccessMsg('Flight deleted successfully.');
      },
      error: (error) => {
        this.showErrorMsg(
          error.error.message || 'Failed to delete flight. Please try again.'
        );
        this.isLoading = false;
        this.showConfirmationDeleteDialog = false;
        this.flightToDelete = undefined;
      },
    });
  }

  cancelDelete(): void {
    this.showConfirmationDeleteDialog = false;
    this.flightToDelete = undefined;
  }

  openDeleteConfirmation(flightId: number, event: Event): void {
    event.preventDefault(); // Prevent router navigation
    this.flightToDelete = flightId;
    this.showConfirmationDeleteDialog = true;
  }
}
