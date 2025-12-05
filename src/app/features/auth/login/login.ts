import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }
  get passwordControl() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.loginError = null;

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const loginRequest = {
        email: email,
        password: password
      };
      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.router.navigate(['/transactions']); // Redirect to transactions page, TODO: Change it to dashboard later
          console.log('Login successful', response);
        },
        error: (error) => {
          this.loginError = error?.error?.message || 'Login failed. Please try again.';
          this.changeDetectorRef.markForCheck();
          console.error('Login failed', error);
        }
      });
    }
  }
}
