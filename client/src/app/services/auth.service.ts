import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { PersistenceService } from '@services/persistence.service';
import { LocalStorageEnums } from '@config/localStorage/localStorageEnums';
import { RoutesEnums } from '@config/routes/routesEnums';
import {
    LoginRequest,
    LoginResponse,
    RegisterResponse,
} from '@config/types/auth/credentails.type';
import { UserInterface } from '@config/types/user/user.interface';
import { CookiesEnums } from '@config/cookie/cookiesEnums';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private accessToken = new BehaviorSubject<string | null>(null);
    private ownId: string = '';

    constructor(
        private http: HttpClient,
        private router: Router,
        private persistenceService: PersistenceService,
    ) {
        const accessToken = this.persistenceService.get(
            LocalStorageEnums.ACCESS_TOKEN,
        );
        if (accessToken) {
            this.accessToken.next(accessToken);
        }
    }

    login(data: LoginRequest): Observable<LoginResponse> {
        return this.http
            .post<LoginResponse>(environment.apiUrl + '/auth/login', data, {
                withCredentials: true,
            })
            .pipe(
                map((response) => {
                    this.accessToken.next(response.accessToken);
                    this.router.navigate([RoutesEnums.MAIN]);
                    return response;
                }),
            )
            .pipe(
                tap(() => {
                    this.http
                        .get<Partial<UserInterface>>(
                            environment.apiUrl + '/user/me',
                        )
                        .subscribe((response) => {
                            this.ownId = response.id!;
                        });
                }),
            );
    }

    register(data: LoginRequest): Observable<RegisterResponse> {
        return this.http
            .post<RegisterResponse>(environment.apiUrl + '/auth/register', data)
            .pipe(
                map((response) => {
                    this.router.navigate([
                        RoutesEnums.AUTH,
                        RoutesEnums.AUTH_LOGIN,
                    ]);
                    return response;
                }),
            );
    }

    setTokenToLS(token: string): void {
        this.persistenceService.set(LocalStorageEnums.ACCESS_TOKEN, token);
    }

    removeCredentials(): void {
        this.ownId = '';
        this.accessToken.next(null);
        this.persistenceService.removeKey(LocalStorageEnums.ACCESS_TOKEN);
        this.persistenceService.removeKey(LocalStorageEnums.APP_CONFIG);
    }

    get token(): string | null {
        return this.accessToken.value;
    }

    get getOwnId() {
        return this.ownId;
    }

    refreshAccessToken() {
        return this.http
            .get<LoginResponse>(environment.apiUrl + '/auth/refresh-tokens', {
                withCredentials: true,
            })
            .pipe(
                tap({
                    next: (response) => {
                        this.accessToken.next(response.accessToken);
                        if (
                            this.persistenceService.get(
                                LocalStorageEnums.ACCESS_TOKEN,
                            )
                        ) {
                            this.setTokenToLS(response.accessToken);
                        }
                    },
                    error: () => {
                        this.removeCredentials();
                        this.router.navigate([
                            RoutesEnums.AUTH,
                            RoutesEnums.AUTH_LOGIN,
                        ]);
                    },
                }),
            );
    }

    logout() {
        return this.http.get(environment.apiUrl + '/auth/logout').pipe(
            switchMap(() => {
                this.removeCredentials();
                return of(null);
            }),
        );
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }
}
