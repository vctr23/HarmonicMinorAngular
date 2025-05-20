import { Injectable } from '@angular/core';
import { Firestore, deleteField, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteUser, verifyBeforeUpdateEmail } from 'firebase/auth';
import { sendPasswordResetEmail } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService, private firestore: Firestore) { }

  // User
  getUserData(): Observable<any> {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef);
  }

  updateUserName(newUserName: string): Promise<void> {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, { username: newUserName }, { merge: true });
  }

  updateUserEmail(newEmail: string): Promise<void> {
    const user = this.authService.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    return verifyBeforeUpdateEmail(user, newEmail);
  }

  updateUserPassword(email: string): Promise<void> {
    const user = this.authService.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    return sendPasswordResetEmail(this.authService.auth, email);
  }

  async deleteUserAccount(): Promise<void> {
    const user = this.authService.currentUser;
    if (!user) throw new Error('Usuario no autenticado');


    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const addressDocRef = doc(this.firestore, `address/${user.uid}`);
    await deleteDoc(userDocRef);
    await deleteDoc(addressDocRef);

    await deleteUser(user);
  }

  // Address
  getUserAddressData(): Observable<any> {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `address/${uid}`);
    return docData(userRef);
  }

  postUserAddressData(addressData: any): Promise<void> {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `address/${uid}`);
    return setDoc(userRef, addressData, { merge: true });
  }

  // Favourites
  addToFavourites(category: string, id: string) {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, {
      favorites: {
        [category]: {
          [id]: true
        }
      }
    }, { merge: true });
  }

  removeFromFavourites(category: string, id: string) {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, {
      [`favorites.${category}.${id}`]: deleteField()
    });
  }

  getFavourites() {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef);
  }

  addToCart(category: string, id: string) {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, {
      cart: {
        [category]: {
          [id]: true
        }
      }
    }, { merge: true });
  }

  removeFromCart(category: string, id: string) {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, {
      [`cart.${category}.${id}`]: deleteField()
    });
  }

  getCart() {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef);
  }
}

