import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const confirmPasswordValidator = (passwordField: string, confirmPasswordField: string): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get(passwordField)?.value;
    const confirmPassword = formGroup.get(confirmPasswordField)?.value;
    return password === confirmPassword ? null : { PasswordNoMatch: true };
  };
};
