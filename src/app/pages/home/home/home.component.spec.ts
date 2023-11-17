import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FinancialProductsService } from '../../../services/financial-products.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AddComponent } from '../add/add.component';
import { Router } from '@angular/router';

const mockFinancialProductsService = {
  getProducts: () =>
    of([
      {
        id: 'fdsfsdfsd',
        name: 'ffsdf',
        description: 'sdfsdfsdfsdf',
        logo: 'sdfsdfsdf',
        date_release: '2023-11-22',
        date_revision: '2026-10-18',
      },
      {
        id: 'fdsfsdfsdd',
        name: 'esp',
        description: 'sdfsdfsdfsdf',
        logo: 'sdfsdfsdf',
        date_release: '2023-11-22',
        date_revision: '2026-10-18',
      },
      {
        id: 'fdsfsdfsda',
        name: 'ffsdf',
        description: 'sdfsdfsdfsdf',
        logo: 'sdfsdfsdf',
        date_release: '2023-11-22',
        date_revision: '2026-10-18',
      },
      {
        id: 'fdsfsdfsdwe',
        name: 'ffsdf',
        description: 'sdfsdfsdfsdf',
        logo: 'sdfsdfsdf',
        date_release: '2023-11-22',
        date_revision: '2026-10-18',
      },
      {
        id: 'fdsfsdfsdew',
        name: 'ffsdf',
        description: 'sdfsdfsdfsdf',
        logo: 'sdfsdfsdf',
        date_release: '2023-11-22',
        date_revision: '2026-10-18',
      },
    ]),
  deleteProduct: () => of(true),
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'home/producto/:action', component: AddComponent },
          { path: 'home/producto/:action/:id', component: AddComponent },
        ]),
        FormsModule,
      ],
      declarations: [HomeComponent],
      providers: [
        {
          provide: FinancialProductsService,
          useValue: mockFinancialProductsService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(window, 'alert');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.products.length).toBe(5);
  });

  it('should products length to be 0', () => {
    spyOn(mockFinancialProductsService, 'getProducts').and.returnValue(of([]));
    component.ngOnInit();
    expect(component.products.length).toBe(0);
  });

  it('should actionchage to be - ', () => {
    spyOn(window, 'confirm');
    component.actionChange({ target: { value: '-' } }, 'fakeID');
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it('should actionchage to be editar ', () => {
    spyOn(router, 'navigate');
    component.actionChange({ target: { value: 'editar' } }, 'fakeID');
    expect(router.navigate).toHaveBeenCalledWith([
      '/home/producto',
      'editar',
      'fakeID',
    ]);
  });

  it('should actionchage to be eliminar ', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.actionChange({ target: { value: 'eliminar' } }, 'fakeID');
  });

  it('should be last page', () => {
    component.products.length = 3;
    expect(component.lastPage()).toBe(1);
  });

  it('should search', () => {
    component.searchText = 'esp';
    component.search();
    expect(component.products.length).toBe(1);
  });
});
