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
    // Check if username is empty
    if (!this.username || this.username.trim() === '') {
      this.errorMessage = 'Username is required';
      return;
    }

    // Check if email is empty
    if (this.email.trim() === '') {
      this.errorMessage = 'Email is required';
      return;
    }

    // Check email format
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Invalid email format';
      return;
    }

    // Check if password length is correct
    if (this.password.length < 6 || this.password.length > 12) {
      this.errorMessage = 'Password must be between 6 and 12 characters';
      return;
    }

    // Check if both passwords are the same
    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (credential) => {
        alert('Registration successful ' + credential);
        this.errorMessage = '';
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed: ' + err;
      },
    });
  }

  // Function to validate email format via regex
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

