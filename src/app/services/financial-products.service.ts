import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class FinancialProductsService {
  productsS: any[] = [];
  constructor(private _http: HttpClient) {}

  getProducts(): Observable<any> {
    return this._http.get(`${environment.BASEURL}/bp/products`).pipe(
      map((data: any) =>
        data.map((p: any) => {
          return {
            ...p,
            date_release: this.cleanDate(p.date_release),
            date_revision: this.cleanDate(p.date_revision),
          };
        }),
      ),
    );
  }

  checkIdProduct(id: string): Observable<any> {
    return this._http.get(
      `${environment.BASEURL}/bp/products/verification?id=${id}`,
    );
  }

  createFinancialProduct(product: any): Observable<any> {
    return this._http.post(`${environment.BASEURL}/bp/products`, product);
  }

  editFinancialProduct(product: any): Observable<any> {
    return this._http.put(`${environment.BASEURL}/bp/products`, product);
  }

  deleteProduct(idProduct: string): Observable<any> {
    return this._http.delete(
      `${environment.BASEURL}/bp/products?id=${idProduct}`,
      { responseType: 'text' },
    );
  }

  cleanDate(date: string) {
    let dateParsed = new Date(date);
    return dateParsed.toISOString().split('T')[0];
  }
}
