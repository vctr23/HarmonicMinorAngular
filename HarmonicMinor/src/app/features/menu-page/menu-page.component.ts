import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import { deleteUser } from 'firebase/auth';


@Component({
  selector: 'app-menu-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.css'
})
export class MenuPageComponent implements OnInit {
  // User data
  username: string = '';
  email: string = '';
  // Address data
  location: string = '';
  phone: string = '';
  id: string = '';
  country: string = '';
  name: string = '';
  lastname: string = '';
  postcode: string = '';
  street: string = '';

  // Username
  editUserName: boolean = false;
  newUserName: string = '';

  // Email
  editEmail: boolean = false;
  newEmail: string = '';

  sessionDuration: string = '';
  activeTab: string = 'profile';
  errorMessage: string = '';
  errorMessageAddress: string = '';

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.userService.getUserData().subscribe({
      next: (userData) => {
        if (userData) {
          this.username = userData.username || 'User';
          this.email = userData.email || 'Email';
          this.errorMessage = '';
        } else {
          this.errorMessage = 'No user data found';
          this.username = 'Invited';
          this.email = '';
        }
        this.updateSessionDuration();
      },
      error: (err) => {
        this.errorMessage = 'Error while retrieving user data:' + err;
        this.username = 'Invited';
        this.email = '';
      }
    });


    this.userService.getUserAddressData().subscribe({
      next: (userAddressData) => {
        if (userAddressData) {
          this.id = userAddressData.id || '';
          this.country = userAddressData.country || '';
          this.name = userAddressData.name || '';
          this.lastname = userAddressData.lastname || '';
          this.postcode = userAddressData.postcode || '';
          this.street = userAddressData.street || '';
          this.location = userAddressData.locality || '';
          this.phone = userAddressData.phone || '';
          this.errorMessageAddress = '';
        } else {
          this.errorMessageAddress = 'No address data found';
        }
      },
      error: (err) => {
        this.errorMessageAddress = 'Error while retrieving user address data:' + err;
        this.location = 'Location';
        this.phone = 'Phone';
        this.id = 'id';
        this.country = 'country';
        this.name = 'name';
        this.lastname = 'lastName';
        this.postcode = 'postalCode';
        this.street = 'street';
      }
    })

    setInterval(() => this.updateSessionDuration(), 60000);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        alert('Session closed successfully');
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });
  }


  postUserAddressData(): void {
    const addressData = {
      id: this.id,
      country: this.country,
      name: this.name,
      lastname: this.lastname,
      postcode: this.postcode,
      street: this.street,
      locality: this.location,
      phone: this.phone
    };

    this.userService.postUserAddressData(addressData).then(() => {
      alert('Address data saved successfully');
      this.errorMessageAddress = '';
    }).catch((err) => {
      this.errorMessageAddress = 'Error saving address data' + err;
    });
  }

  onEditUserName(): void {
    this.editUserName = true;
    this.newUserName = this.username;
  }

  saveUserName(): void {
    if (this.newUserName.trim() !== '') {
      this.userService.updateUserName(this.newUserName).then(() => {
        this.username = this.newUserName;
        this.editUserName = false;
        this.errorMessage = '';
        alert('Username updated successfully');
      }).catch((err) => {
        this.errorMessage = 'Error updating username' + err;
      });
    } else {
      this.errorMessage = 'Username cannot be empty';
    }
  }

  cancelEditUserName(): void {
    this.editUserName = false;
  }

  onEditEmail(): void {
    this.editEmail = true;
    this.newEmail = this.email;
  }

  saveEmail(): void {
    if (this.newEmail.trim() !== '') {
      this.userService.updateUserEmail(this.newEmail).then(() => {
        this.email = this.newEmail;
        this.editEmail = false;
        this.errorMessage = '';
        alert('Email updated successfully');
      }).catch((err) => {
        this.errorMessage = 'Error updating email' + err;
      });
    } else {
      this.errorMessage = 'Email cannot be empty';
    }
  }

  cancelEditEmail(): void {
    this.editEmail = false;
  }

  deleteUserAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.userService.deleteUserAccount().then(() => {
        alert('Account deleted successfully');
        this.router.navigate(['/']);
      }).catch((err) => {
        this.errorMessage = 'Error deleting account: ' + err;
      });
    }
  }

  updateSessionDuration(): void {
    const sessionStartTime = this.authService.getSessionStartTime();
    if (sessionStartTime) {
      const now = new Date();
      const diffMs = now.getTime() - sessionStartTime.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;

      this.sessionDuration = `${hours}h ${minutes}m`;
    } else {
      this.sessionDuration = 'Not available';
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

}
