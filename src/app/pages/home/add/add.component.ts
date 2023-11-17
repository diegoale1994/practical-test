import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionsEnum } from 'src/app/models/add.actions';
import { FinancialProductsService } from 'src/app/services/financial-products.service';
import {
  majorDate,
  majorDateOneYear,
} from 'src/app/validators/dates.validator';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  action: string = '';

  form = new FormGroup({
    id: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200),
    ]),
    logo: new FormControl('', [Validators.required]),
    date_release: new FormControl('', [Validators.required, majorDate()]),
    date_revision: new FormControl('', [Validators.required]),
  });

  constructor(
    private _financialProductsService: FinancialProductsService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    const snapshot = this._route.snapshot;
    this.action = snapshot.params['action'];
    this.updateValidators();
    this.checkDatesChanges();
    this.checkEditScenario();
  }

  checkEditScenario() {
    const snapshot = this._route.snapshot;
    if (this.action === ActionsEnum.EDIT) {
      let idParam = snapshot.params['id'];
      let product = this._financialProductsService.productsS.find(
        (product) => product.id === idParam
      );
      this.form.patchValue(product);
      this.form.controls['id'].disable();
    }
  }

  checkDatesChanges() {
    this.form
      .get('date_release')
      ?.valueChanges.subscribe(() =>
        this.form.controls['date_revision'].updateValueAndValidity()
      );
  }

  private updateValidators() {
    this.form.controls['date_revision'].setValidators([
      Validators.required,
      majorDateOneYear(this.form),
    ]);
    this.form.controls['date_revision'].updateValueAndValidity();
  }

  send(): void {
    if (this.action == ActionsEnum.CREATE) {
      this._financialProductsService
        .createFinancialProduct(this.form.value)
        .subscribe((r) => {
          if (r.id == this.form.value.id) {
            alert('producto creado con exito');
            this._router.navigate(['/home']);
          }
        });
      return;
    }

    if (this.action == ActionsEnum.EDIT) {
      this._financialProductsService
        .editFinancialProduct(this.form.getRawValue())
        .subscribe((r) => {
          if (r.id == this.form.getRawValue().id) {
            alert('producto editado con exito');
            this._router.navigate(['/home']);
          }
        });
      return;
    }
  }

  checkID() {
    const currentId = this.form.controls['id'].value ?? '';
    this._financialProductsService.checkIdProduct(currentId).subscribe((r) => {
      if (r == true) {
        this.form.controls['id'].setValue('');
        const currentErrors = this.form.controls['id'].errors;
        this.form.controls['id'].setErrors({ ...currentErrors, id: true });
      }
    });
  }

  getErrors(campo: string) {
    const control = this.form.get(campo);

    if (control && control.errors) {
      return control.errors;
    }

    return null;
  }

  isTouchedAndInvalid(campo: string) {
    const control = this.form.get(campo);
    return control && control.touched && control.invalid;
  }

  resetForm() {
    this.form.reset();
  }
}
