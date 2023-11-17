import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { AddComponent } from './add.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '../home/home.component';
import { of } from 'rxjs';
import { FinancialProductsService } from 'src/app/services/financial-products.service';
import { Router } from '@angular/router';

const mockFinancialProductsService = {
  productsS: [
    {
      id: 'fdsfsdfsdwe',
      name: 'ffsdf',
      description: 'sdfsdfsdfsdf',
      logo: 'sdfsdfsdf',
      date_release: '2023-11-22',
      date_revision: '2026-10-18',
    },
  ],
  createFinancialProduct: () =>
    of({
      id: 'fdsfsdfsdwe',
    }),
  checkIdProduct: () => of(true),
  editFinancialProduct: () =>
    of({
      id: 'fdsfsdfsdwe',
    }),
};

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: HomeComponent },
        ]),
        ReactiveFormsModule,
        FormsModule,
      ],
      declarations: [AddComponent],
      providers: [
        {
          provide: FinancialProductsService,
          useValue: mockFinancialProductsService,
        },
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(window, 'alert');
  });

  it('should create', () => {
    component.resetForm();
    expect(component).toBeTruthy();
  });

  it('should update date_revision control when date_release changes', fakeAsync(() => {
    const dateRelease = '2024-01-19';
    component.form.get('date_release')?.setValue(dateRelease);
    tick(1);
    expect(component.form.get('date_release')?.value).toEqual(dateRelease);
  }));

  it('should create product', () => {
    spyOn(router, 'navigate');
    component.action = 'crear';
    component.form.patchValue({
      id: 'fdsfsdfsdwe',
      name: 'ffsdf',
      description: 'sdfsdfsdfsdf',
      logo: 'sdfsdfsdf',
      date_release: '2023-11-22',
      date_revision: '2026-10-18',
    });
    component.send();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should edit product', () => {
    spyOn(router, 'navigate');
    component.action = 'editar';
    component.form.patchValue({
      id: 'fdsfsdfsdwe',
      name: 'ffsdf',
      description: 'sdfsdfsdfsdf',
      logo: 'sdfsdfsdf',
      date_release: '2023-11-22',
      date_revision: '2026-10-18',
    });
    component.send();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should check id if valid', () => {
    component.checkID();
    expect(component.form.get('id')?.value).toBe('');
  });

  it('should return errors for a specific form control', () => {
    expect(component.getErrors('id')).toBeDefined();
  });

  it('should return not errors for a specific form control', () => {
    component.form.get('name')?.setValue('fakenamewithlongcharactrers');
    expect(component.getErrors('name')).toBeNull();
  });

  it('should init component with edit action', () => {
    component.action = 'editar';

    component.checkEditScenario();
  });

  it('should return error if release date is not major current date', fakeAsync(() => {
    const dateRelease = '2022-01-19';
    component.form.get('date_release')?.setValue(dateRelease);
    tick(1);
    expect(component.form.get('date_release')?.errors).toEqual({
      majorDate: true,
    });
  }));

  it('should return error if diff years < 1 year', fakeAsync(() => {
    const dateRelease = '2022-05-19';
    const dateRevision = '2023-01-19';
    component.form.get('date_release')?.setValue(dateRelease);
    component.form.get('date_revision')?.setValue(dateRevision);
    tick(1);
    expect(component.form.get('date_revision')?.errors).toEqual({
      MajorDateOneYear: true,
    });
  }));
});
