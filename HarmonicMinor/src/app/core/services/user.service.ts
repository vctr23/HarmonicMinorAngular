import { Injectable } from '@angular/core';
import { Firestore, deleteField, doc, docData, setDoc } from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
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
  async addToFavourites(category: string, id: string) {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await firstValueFrom(docData(userRef));
    const favorites = userSnap?.['favorites'] || {};
    const categoryList: string[] = favorites[category] || [];

    if (!categoryList.includes(id)) {
      categoryList.push(id);
    }

    return setDoc(userRef, {
      favorites: {
        ...favorites,
        [category]: categoryList
      }
    }, { merge: true });
  }

  async removeFromFavourites(category: string, id: string) {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await firstValueFrom(docData(userRef));
    const favorites = userSnap?.['favorites'] || {};
    let categoryList: string[] = favorites[category] || [];

    categoryList = categoryList.filter((itemId: string) => itemId !== id);

    return setDoc(userRef, {
      favorites: {
        ...favorites,
        [category]: categoryList
      }
    }, { merge: true });
  }

  getFavourites() {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef);
  }

  async clearFavourites() {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');
    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, { favorites: {} }, { merge: true });
  }

  // Cart
  async addToCart(category: string, id: string) {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await firstValueFrom(docData(userRef));
    const cart = userSnap?.['cart'] || {};
    const categoryList: string[] = cart[category] || [];

    if (!categoryList.includes(id)) {
      categoryList.push(id);
    }

    return setDoc(userRef, {
      cart: {
        ...cart,
        [category]: categoryList
      }
    }, { merge: true });
  }

  async removeFromCart(category: string, id: string) {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await firstValueFrom(docData(userRef));
    const cart = userSnap?.['cart'] || {};
    let categoryList: string[] = cart[category] || [];

    categoryList = categoryList.filter((itemId: string) => itemId !== id);

    return setDoc(userRef, {
      cart: {
        ...cart,
        [category]: categoryList
      }
    }, { merge: true });
  }

  getCart() {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef);
  }

  async clearCart() {
    const uid = this.authService.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');
    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, { cart: {} }, { merge: true });
  }
}

