import { Component} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
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


    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        alert('Login successful '+ user.user.email),
        this.errorMessage = '';
        this.router.navigate(['/home'])
      },
      error: (err) => {
        this.errorMessage = 'Login failed: ' + err;
      },
    })
  }


  // Function to validate email format via regex
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
