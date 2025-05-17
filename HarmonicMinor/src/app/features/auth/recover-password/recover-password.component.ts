import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recover-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {
  email: string = '';
  message: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService) { }

  changePassword(): void {
    // Check email is not empty
    if (this.email.trim() === '') {
      this.errorMessage = 'Email is required';
      return;
    }

    // Check email format
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Invalid email format';
      return;
    }

    this.userService.updateUserPassword(this.email).then(() => {
      this.message = 'Password reset email sent successfully';
      this.errorMessage = '';
    }).catch((err) => {
      this.errorMessage = 'Error sending password reset email: ' + err;
      this.message = '';
    });
  }

  // Function to validate email format via regex
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
