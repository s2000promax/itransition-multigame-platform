import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { AuthService } from '@services/auth.service';
import {
    BehaviorSubject,
    catchError,
    filter,
    finalize,
    Observable,
    switchMap,
    take,
    throwError,
} from 'rxjs';
import { LoaderService } from '@services/loader.service';
import { Router } from '@angular/router';
import { RoutesEnums } from '@config/routes/routesEnums';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({
    checkProperties: true,
})
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private loaderService: LoaderService,
        private router: Router,
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        this.loaderService.setLoadingState(true);

        request = request.clone({});

        return next.handle(request);
    }
}
