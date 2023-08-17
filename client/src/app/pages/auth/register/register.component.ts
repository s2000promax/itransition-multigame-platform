import { Component, OnInit } from '@angular/core';
import { RoutesEnums } from '@config/routes/routesEnums';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from '@shared/types/forms/form.interface';
import { RegisterRequest } from '@config/types/auth/credentails.type';
import { AuthService } from '@services/auth.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@UntilDestroy({
    checkProperties: true,
})
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    protected readonly RoutesEnums = RoutesEnums;

    registerForm!: FormGroup<Form<RegisterRequest>>;

    submitted: boolean = false;

    error: string = '';

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.registerForm = this.formBuilder.nonNullable.group({
            email: ['', [Validators.required, Validators.email]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.submitted = true;
            this.error = '';

            const credentials = this.registerForm.getRawValue();

            this.authService.register(credentials).subscribe({
                next: (response) => {
                    this.registerForm.reset();
                    this.submitted = false;
                    this.router.navigate([
                        RoutesEnums.AUTH,
                        RoutesEnums.AUTH_LOGIN,
                    ]);
                },
                error: (error) => {
                    this.error = error;
                    this.submitted = false;
                },
            });
        }
    }
}
