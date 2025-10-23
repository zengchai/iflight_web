import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-error-toast',
  imports: [CommonModule],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss'
})
export class ErrorToastComponent implements OnChanges {
  @Input() message: string = '';
  @Input() visible: boolean = false;
  @Input() type: 'error' | 'warning' | 'success' = 'error';
  @Input() dismissible: boolean = true;
  @Input() duration: number = 3000; 
  
  @Output() dismissed = new EventEmitter<void>();

  // Timeout ID for auto-dismissal
  private timeoutId: any;

  // Called when input properties change
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.setAutoHide();
    }
  }

  private setAutoHide(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (this.duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.hide();
      }, this.duration);
    }
  }

  onDismiss(): void {
    this.hide();
  }

  private hide(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.visible = false;
    this.dismissed.emit();
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}