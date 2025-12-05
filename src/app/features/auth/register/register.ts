import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { confirmPasswordValidator } from '../confirm-password.validator';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, {
      validators: confirmPasswordValidator('password', 'confirmPassword')
    });
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get usernameControl() {
    return this.registerForm.get('username');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  onSubmit() {
    this.registerError = null;

    if (this.registerForm.valid) {
      const { email, username, password } = this.registerForm.value;
      const registerRequest = {
        email: email,
        username: username,
        password: password
      };
      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
          console.log('Registration successful', response);
        },
        error: (error) => {
          this.registerError = error?.error?.message || 'Registration failed. Please try again.';
          this.changeDetectorRef.markForCheck();
          console.error('Registration failed', error);
        }
      });
    }
  }
}
