import { TestBed } from '@angular/core/testing';

import { FinancialProductsService } from './financial-products.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment.dev';

describe('FinancialProductsService', () => {
  let service: FinancialProductsService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FinancialProductsService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products from the API via GET', () => {
    const mockProducts = [
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
    ];

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.BASEURL}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should check product ID via GET request', () => {
    const mockId = 'someId';
    const mockResponse = { value: true };

    service.checkIdProduct(mockId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.BASEURL}/bp/products/verification?id=${mockId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a financial product via POST request', () => {
    const mockProduct = { id: 'fake' };
    const mockResponse = { id: 'fake' };

    service.createFinancialProduct(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.BASEURL}/bp/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct); // Verifica que el cuerpo de la solicitud sea correcto
    req.flush(mockResponse);
  });

  it('should edit a financial product via PUT request', () => {
    const mockProduct = { id: 'fake' };
    const mockResponse = { id: 'fake' };

    service.editFinancialProduct(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.BASEURL}/bp/products`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockResponse);
  });

  it('should delete a financial product via DELETE request', () => {
    const mockId = 'someId';
    const mockResponse = {  };

    service.deleteProduct(mockId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.BASEURL}/bp/products/verification?id=${mockId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
