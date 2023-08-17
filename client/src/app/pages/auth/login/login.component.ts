import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from '@shared/types/forms/form.interface';
import { LoginRequest } from '@config/types/auth/credentails.type';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RoutesEnums } from '@config/routes/routesEnums';
import { Router } from '@angular/router';

interface LoginForm extends LoginRequest {
    isRememberMe: boolean;
}

@UntilDestroy({
    checkProperties: true,
})
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    protected readonly RoutesEnums = RoutesEnums;

    loginForm!: FormGroup<Form<LoginForm>>;

    submitted: boolean = false;

    error: string = '';

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.loginForm = this.formBuilder.nonNullable.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            isRememberMe: [false],
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.submitted = true;
            this.error = '';

            const { email, password, isRememberMe } =
                this.loginForm.getRawValue();

            this.authService.login({ email, password }).subscribe({
                next: (response) => {
                    if (isRememberMe) {
                        this.authService.setTokenToLS(response.accessToken);
                    }

                    this.loginForm.reset();
                    this.submitted = false;
                    this.router.navigate([RoutesEnums.MAIN]);
                },
                error: (error) => {
                    this.error = error;
                    this.submitted = false;
                },
            });
        }
    }
}
