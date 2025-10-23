import { Component, OnInit } from '@angular/core';
import {
  Flight,
  FlightStatus,
} from '../../../../core/models/flights/flight.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlightService } from '../../../../core/services/flight.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlightDatePipe } from '../../../../shared/pipes/flight-date.pipe';
import { FlightStatusPipe } from '../../../../shared/pipes/flight-status.pipe';
import { ErrorToastComponent } from '../../../../shared/components/error/error-toast/error-toast.component';

export type FormMode = 'create' | 'edit' | 'view';
@Component({
  selector: 'app-flight-form',
  imports: [
    CommonModule,
    FlightStatusPipe,
    FlightDatePipe,
    ReactiveFormsModule,
    ErrorToastComponent,
  ],
  templateUrl: './flight-form.component.html',
  styleUrl: './flight-form.component.scss',
})
export class FlightFormComponent implements OnInit {
  flightForm: FormGroup;
  mode: FormMode = 'create';
  flightId?: number;
  flight?: Flight;
  isLoading = false;
  isEditingGate = false;
  tempGateValue = '';
  showConfirmationDialog = false;
  errorMessage = '';
  showError = false;
  successMessage = '';
  showSuccess = false;

  statusOptions = [
    { value: FlightStatus.SCHEDULED, display: 'Scheduled' },
    { value: FlightStatus.ON_TIME, display: 'On Time' },
    { value: FlightStatus.DELAYED, display: 'Delayed' },
    { value: FlightStatus.CANCELLED, display: 'Cancelled' },
    { value: FlightStatus.LANDED, display: 'Landed' },
  ];

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.flightForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.flightId = +params['id'];
        this.mode = (params['action'] as FormMode) || 'view';
        this.loadFlight();
      } else {
        this.mode = 'create';
        this.initializeCreateForm();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      airline: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      destination: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      gate: [
        '',
        [Validators.required, Validators.pattern('^[A-Z]{1,2}\\d{1,3}$')],
      ],
      departureTime: ['', [Validators.required]],
      status: [FlightStatus.SCHEDULED, [Validators.required]],
    });
  }

  initializeCreateForm(): void {
    this.flightForm.patchValue({
      status: FlightStatus.SCHEDULED,
    });
    this.flightForm.get('status')?.disable();
  }

  loadFlight(): void {
    this.isLoading = true;
    this.flightService.getFlightById(this.flightId!).subscribe({
      next: (flight: Flight) => {
        this.flight = flight;
        this.patchFormWithFlightData(flight);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showErrorMsg(
          error.error.message || 'Failed to load flight data. Please try again.'
        );
        setTimeout(() => {
          this.router.navigate(['/flights']);
        }, 2000);
      },
    });
  }

  patchFormWithFlightData(flight: Flight): void {
    if (this.mode === 'view') {
      this.flightForm.patchValue({
        airline: flight.airline,
        destination: flight.destination,
        gate: flight.gate,
        departureTime: flight.departureTime,
        status: flight.status,
      });
      this.flightForm.disable();
    } else if (this.mode === 'edit') {
      this.flightForm.patchValue({
        gate: flight.gate,
        departureTime: this.formatDateForInput(flight.departureTime),
        status: flight.status,
      });
      this.flightForm.get('airline')?.disable();
      this.flightForm.get('destination')?.disable();
    }
  }
  
  private markFormGroupTouched(): void {
    Object.keys(this.flightForm.controls).forEach((key) => {
      const control = this.flightForm.get(key);
      control?.markAsTouched();
    });
  }

  onSubmit(): void {
    if (this.flightForm.invalid) {
      // Show which fields are invalid
      this.markFormGroupTouched();

      if (this.flightForm.get('airline')?.invalid) {
        this.showErrorMsg('Please check the airline field');
      } else if (this.flightForm.get('destination')?.invalid) {
        this.showErrorMsg('Please check the destination field');
      } else if (this.flightForm.get('gate')?.invalid) {
        this.showErrorMsg('Please enter a valid gate (e.g., A12, B3)');
      } else if (this.flightForm.get('departureTime')?.invalid) {
        this.showErrorMsg('Please select a valid departure time');
      }

      return;
    }

    if (this.mode === 'create') {
      this.createFlight();
    } else if (this.mode === 'edit') {
      this.showConfirmationDialog = true;
    }
  }

  confirmUpdate(): void {
    this.isLoading = true;
    this.showConfirmationDialog = false;
    this.updateFlight();
  }

  cancelUpdate(): void {
    this.showConfirmationDialog = false;
  }

  navigateToEdit(): void {
    this.router.navigate(['/flights', this.flightId, 'edit']);
  }

  private createFlight(): void {
    this.isLoading = true;
    const formData = this.flightForm.getRawValue();

    this.flightService
      .createFlight({
        airline: formData.airline,
        destination: formData.destination,
        gate: formData.gate,
        departureTime: formData.departureTime,
      })
      .subscribe({
        next: () => {
          this.showSuccessMsg('Flight created successfully!');
          setTimeout(() => {
            this.navigateBack();
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.showErrorMsg(
            error.error.message || 'Failed to create flight. Please try again.'
          );
        },
      });
  }

  private updateFlight(): void {
    const formData = this.flightForm.getRawValue();

    this.flightService
      .updateFlight(this.flightId!, {
        gate: formData.gate,
        departureTime: formData.departureTime,
        status: formData.status,
      })
      .subscribe({
        next: () => {
          this.showSuccessMsg('Flight updated successfully!');
          setTimeout(() => {
            this.navigateBack();
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.showErrorMsg(
            error.error.message || 'Failed to update flight. Please try again.'
          );
        },
      });
  }

  startEditGate(): void {
    if (this.isEditMode) {
      this.tempGateValue = this.flightForm.get('gate')?.value;
      this.isEditingGate = true;
      this.flightForm.get('gate')?.enable();
    }
  }

  saveGate(): void {
    this.isEditingGate = false;
  }

  cancelEditGate(): void {
    this.isEditingGate = false;
    this.flightForm.get('gate')?.setValue(this.tempGateValue);
  }

  onCancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['/flights']);
  }

  private formatDateForInput(isoString: string): string {
    return isoString.substring(0, 16);
  }

  get isViewMode(): boolean {
    return this.mode === 'view';
  }
  get isEditMode(): boolean {
    return this.mode === 'edit';
  }
  get isCreateMode(): boolean {
    return this.mode === 'create';
  }

  get title(): string {
    switch (this.mode) {
      case 'create':
        return 'Create Flight';
      case 'edit':
        return 'Edit Flight';
      case 'view':
        return `Flight ${this.flight?.flightNumber} Details`;
      default:
        return 'Flight';
    }
  }

  get canSubmit(): boolean {
    if (this.isViewMode) return false;
    if (this.isCreateMode) return this.flightForm.valid;
    if (this.isEditMode) return this.flightForm.valid;
    return false;
  }

  private showErrorMsg(message: string): void {
    this.errorMessage = message;
    this.showError = true;
  }

  private showSuccessMsg(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
  }

  onErrorDismissed(): void {
    this.showError = false;
    this.errorMessage = '';
  }

  onSuccessDismissed(): void {
    this.showSuccess = false;
    this.successMessage = '';
  }
}
