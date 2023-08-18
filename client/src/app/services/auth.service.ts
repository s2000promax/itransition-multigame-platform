import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { PersistenceService } from '@services/persistence.service';
import { LocalStorageEnums } from '@config/localStorage/localStorageEnums';
import { RoutesEnums } from '@config/routes/routesEnums';
import { UserInterface } from '@config/types/user/user.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private username = new BehaviorSubject<string | null>(null);

    constructor(
        private router: Router,
        private persistenceService: PersistenceService,
    ) {
        const username = this.persistenceService.get(
            LocalStorageEnums.USER_NAME,
        );
        if (username) {
            this.username.next(username);
        }
    }

    login(user: UserInterface) {
        this.username.next(user.username);
        return this.router.navigate([RoutesEnums.DASHBOARD]);
    }

    setUsernameToLS(username: string): void {
        this.persistenceService.set(LocalStorageEnums.USER_NAME, username);
    }

    removeCredentials(): void {
        this.username.next(null);
        this.persistenceService.removeKey(LocalStorageEnums.USER_NAME);
        this.persistenceService.removeKey(LocalStorageEnums.APP_CONFIG);
    }

    get getUsername(): string | null {
        return this.username.value;
    }

    logout() {
        this.removeCredentials();
        return this.router.navigate([RoutesEnums.AUTH_LOGIN]);
    }

    isAuthenticated(): boolean {
        return !!this.username;
    }
}
