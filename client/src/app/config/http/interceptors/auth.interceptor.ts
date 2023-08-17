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
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<string | null> =
        new BehaviorSubject<string | null>(null);

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

        request = request.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: this.authService.token ?? '',
                'Access-Control-Allow-Origin':
                    'https://itransition-4.vercel.app',
                'Access-Control-Allow-Credentials': 'true',
            },
        });

        return next.handle(request).pipe(
            catchError((err) => {
                if (err.status === 401) {
                    if (this.isRefreshing) {
                        return this.handle401Error(request, next);
                    } else {
                        this.isRefreshing = true;
                        this.refreshTokenSubject.next(null);

                        return this.authService.refreshAccessToken().pipe(
                            switchMap((newTokens) => {
                                this.isRefreshing = false;
                                this.refreshTokenSubject.next(
                                    newTokens.accessToken,
                                );

                                return next.handle(
                                    request.clone({
                                        setHeaders: {
                                            Authorization:
                                                newTokens.accessToken ?? '',
                                        },
                                    }),
                                );
                            }),
                        );
                    }
                } else if (err.status === 403) {
                    this.authService.logout().subscribe();
                    this.router.navigate([
                        RoutesEnums.AUTH,
                        RoutesEnums.AUTH_ACCESS,
                    ]);
                }
                const error = err.error.message || err.statusText;

                return throwError(error);
            }),

            finalize(() => this.loaderService.setLoadingState(false)),
        );
    }

    private handle401Error(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        return this.refreshTokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((accessToken) => {
                return next.handle(
                    request.clone({
                        setHeaders: { Authorization: accessToken ?? '' },
                    }),
                );
            }),
            catchError((refreshErr) => {
                this.isRefreshing = false;
                this.authService.logout().subscribe();

                return throwError(refreshErr);
            }),
        );
    }
}
