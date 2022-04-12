import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { SharedModule } from '../shared.module';
import { SharedService } from './shared.service';

@Injectable()
export class SppinerInterceptor implements HttpInterceptor {

  constructor( private readonly sh:SharedService ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.sh.showLoading();
    return next.handle(request).pipe(
      finalize(() => this.sh.hideLoading())
    );
  }
}
