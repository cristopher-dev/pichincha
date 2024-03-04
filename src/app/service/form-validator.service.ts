import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidatorService {
  constructor() {}

  currentDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }

      const currentDate = new Date();
      const selectedDate = new Date(control.value);
      return selectedDate >= currentDate ? null : { fechaActual: true };
    };
  }

  dateRevisionValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dateReleaseControl = control.root.get('date_release');
      if (!control.value || !dateReleaseControl) {
        return null;
      }

      const dateRelease = new Date(dateReleaseControl.value);
      const reviewDate = new Date(control.value);
      dateRelease.setFullYear(dateRelease.getFullYear() + 1);

      return reviewDate >= dateRelease ? null : { reviewDate: true };
    };
  }
}
