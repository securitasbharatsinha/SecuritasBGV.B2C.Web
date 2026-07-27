import { DatePipe } from '@angular/common';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AuthService } from '../api-services/auth.services';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export class CustomValidators {

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        // if control is empty return no error
        return error;
      }
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }
  static emailHasUppercase(
    regex: RegExp,
    error: ValidationErrors
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        // if control is empty return no error
        return error;
      }
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? error : null;
    };
  }

  static emailValidator(authService: AuthService): AsyncValidatorFn {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      return authService.isEmailExists(control.value).pipe(
        map((result: any) => {
          return result && result.IsSuccess
            ? { emailAlreadyExists: true }
            : null;
        })
      );
    };
  }
  static gstValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return authService.isGSTExists(control.value).pipe(
        tap((res) => { }),
        map((result: any) => {
          return result && result?.Data.Id
            ? { gstAlreadyExists: true, err: result?.Data?.CompanyGSTMessage }
            : null;
        })
      );
    };
  }
}
