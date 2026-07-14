import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function taxNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (!/^\d{8}$/.test(value)) {
      return { taxNumber: true };
    }

    const digits = value.split('').map(Number);
    const weights = [9, 7, 3, 1, 9, 7, 3];

    const sum = weights.reduce((acc, weight, index) => acc + digits[index] * weight, 0);
    const checksum = sum % 10;

    return checksum === digits[7] ? null : { taxNumber: true };
  };
}
