import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthorService } from '../services/author.service';

@Injectable()
export class MainInterceptor implements HttpInterceptor {
  constructor(private _authorService: AuthorService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedReq = req.clone({
      headers: req.headers.set('authorId', this._authorService.authorId + ''),
    });

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          alert('Header ‘authorId’ is missing');
        } else if (error.status === 401) {
          alert('you must be the owner');
        } else if (error.status === 404) {
          alert('product not found with that id');
        }else if (error.status === 0) {
          alert('CORS error');
        }

        return throwError(() => error);
      })
    );
  }
}
