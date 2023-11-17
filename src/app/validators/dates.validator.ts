import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function majorDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const typedDate = control.value;

    if (!typedDate) {
      return null;
    }

    const currentDate = new Date();
    const typedDateDate = new Date(typedDate);
    currentDate.setHours(0, 0, 0, 0);

    if (typedDateDate > currentDate) {
      return null;
    } else {
      return { majorDate: true };
    }
  };
}

export function majorDateOneYear(group: FormGroup): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const typedDate = control.value;

    if (!typedDate || !group.controls['date_release'].value) {
      return null;
    }

    const releasedDate = new Date(group.controls['date_release'].value);
    const typedDateDate = new Date(typedDate);

    const diferenciaEnMilisegundos =
      typedDateDate.getTime() - releasedDate.getTime();
    const diferenciaEnAnios =
      diferenciaEnMilisegundos / (1000 * 60 * 60 * 24 * 365);

    if (diferenciaEnAnios >= 1) {
      return null;
    } else {
      return { MajorDateOneYear: true };
    }
  };
}
