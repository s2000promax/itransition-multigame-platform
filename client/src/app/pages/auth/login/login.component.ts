import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from '@shared/types/forms/form.interface';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RoutesEnums } from '@config/routes/routesEnums';
import { Router } from '@angular/router';
import { UserInterface } from '@config/types/user/user.interface';

interface LoginForm extends UserInterface {
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

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.loginForm = this.formBuilder.nonNullable.group({
            username: ['', [Validators.required]],
            isRememberMe: [false],
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.submitted = true;

            const { username, isRememberMe } = this.loginForm.getRawValue();

            this.authService.login({ username });

            if (isRememberMe) {
                this.authService.setUsernameToLS(username);
            }

            this.loginForm.reset();
            this.submitted = false;
        }
    }
}
