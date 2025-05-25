import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }


  register() {
    if (!this.username || this.username.trim() === '') {
      this.errorMessage = 'Username is required';
      return;
    }

    if (this.email.trim() === '') {
      this.errorMessage = 'Email is required';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Invalid email format';
      return;
    }

    if (this.password.length < 6 || this.password.length > 12) {
      this.errorMessage = 'Password must be between 6 and 12 characters';
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (credential) => {
        alert('Registration successful ' + credential.user.email);
        this.errorMessage = '';
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed: ' + err;
      },
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

