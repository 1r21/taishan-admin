import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError, EMPTY, TimeoutError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LocalStorageService } from '../cache/local-storage.service';
import { Router } from '@angular/router';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  private baseUrl = environment.serverUrl;
  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private store: LocalStorageService
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const localUser = this.store.get('user');
    const user = localUser?.value;
    const token = user?.token; // add interface validate
    const isLoginReq = req.url === '/admin/user';

    let fullReq = req.clone({
      url: this.baseUrl + req.url,
    });

    if (!isLoginReq) {
      if (!token) {
        this.router.navigateByUrl('/login');
        this.snackBar.open('please login');
        return EMPTY;
      } else {
        fullReq = req.clone({
          ...fullReq,
          headers: req.headers.set('X-Token', token),
        });
      }
    }

    return next.handle(fullReq).pipe(
      mergeMap((event: any) => {
        if (event instanceof HttpResponse) {
          const body: any = event.body;
          const { code, data, message } = body;
          if (code !== 0) {
            if (String(code).includes('30')) {
              this.store.remove(user);
            }
            return throwError(message);
          }
          return of(event.clone({ body: data }));
        }
        return of(event);
      }),
      catchError((err: string | HttpErrorResponse | TimeoutError) => {
        if (typeof err === 'string') {
          this.snackBar.open(err);
        }
        if (err instanceof HttpErrorResponse) {
          this.snackBar.open(err.message);
        }
        if (err instanceof TimeoutError) {
          this.snackBar.open(err.message);
        }
        return throwError(err);
      })
    );
  }
}
