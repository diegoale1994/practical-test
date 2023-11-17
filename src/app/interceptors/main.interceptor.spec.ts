import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { AuthorService } from '../services/author.service';
import { MainInterceptor } from './main.interceptor';

describe('MainInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MainInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    spyOn(window, 'alert');
  });

  it('should add authorId header to the request', inject(
    [AuthorService],
    (authorService: AuthorService) => {
      const authorId = 123;
      authorService.authorId = 123;

      httpClient.get('/api/data').subscribe((response) => {
        expect(response).toBeTruthy();
      });
      const req = httpMock.expectOne('/api/data');
      expect(req.request.headers.get('authorId')).toEqual(authorId.toString());
      req.flush({});
      httpMock.verify();
    }
  ));

  it('should handle 400 error', inject([AuthorService], (authorService: AuthorService) => {

    authorService.authorId = 123;
  
    httpClient.get('/api/error/400').subscribe(
      () => fail('Expected an error, but received a successful response'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(400);
        expect(error.error).toBeDefined();
      }
    );
  
    const req = httpMock.expectOne('/api/error/400');
    req.flush({}, { status: 400, statusText: 'Bad Request' });
    httpMock.verify();
  }));

  it('should handle 401 error', inject([AuthorService], (authorService: AuthorService) => {

    authorService.authorId = 123;
  
    httpClient.get('/api/error/400').subscribe(
      () => fail('Expected an error, but received a successful response'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(401);
        expect(error.error).toBeDefined();
      }
    );
  
    const req = httpMock.expectOne('/api/error/400');
    req.flush({}, { status: 401, statusText: 'Bad Request' });
    httpMock.verify();
  }));

  it('should handle 404 error', inject([AuthorService], (authorService: AuthorService) => {

    authorService.authorId = 123;
  
    httpClient.get('/api/error/400').subscribe(
      () => fail('Expected an error, but received a successful response'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
        expect(error.error).toBeDefined();
      }
    );
  
    const req = httpMock.expectOne('/api/error/400');
    req.flush({}, { status: 404, statusText: 'Bad Request' });
    httpMock.verify();
  }));

  it('should handle 0 error CORS', inject([AuthorService], (authorService: AuthorService) => {

    authorService.authorId = 123;
  
    httpClient.get('/api/error/400').subscribe(
      () => fail('Expected an error, but received a successful response'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(0);
        expect(error.error).toBeDefined();
      }
    );
  
    const req = httpMock.expectOne('/api/error/400');
    req.flush({}, { status: 0, statusText: 'Bad Request' });
    httpMock.verify();
  }));

  afterEach(() => {
    httpMock.verify();
  });
});
