import { Injectable } from '@angular/core';
import { Firestore, collectionData, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { collection, deleteDoc } from 'firebase/firestore';
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


  // Instruments
  getGuitarInstruments(): Observable<any> {
    const guitarsRef = collection(this.firestore, 'guitars');
    return collectionData(guitarsRef, {idField: 'id'});
  }

  getBassInstruments(): Observable<any> {
    const bassRef = collection(this.firestore, 'basses');
    return collectionData(bassRef, {idField: 'id'});
  }

  getDrumInstruments(): Observable<any> {
    const drumsRef = collection(this.firestore, 'drums');
    return collectionData(drumsRef, {idField: 'id'});
  }

  getPianoInstruments(): Observable<any> {
    const pianosRef = collection(this.firestore, 'pianos');
    return collectionData(pianosRef, {idField: 'id'});
  }

  getSoftwareInstruments(): Observable<any> { 
    const softwareRef = collection(this.firestore, 'softwares');
    return collectionData(softwareRef, {idField: 'id'});
  }

  getWindInstruments(): Observable<any> {
    const windRef = collection(this.firestore, 'winds');
    return collectionData(windRef, {idField: 'id'});
  }

  getDjInstruments(): Observable<any> {
    const djRef = collection(this.firestore, 'djs');
    return collectionData(djRef, {idField: 'id'});
  }

  getMicrophoneInstruments(): Observable<any> {
    const microphoneRef = collection(this.firestore, 'microphones');
    return collectionData(microphoneRef, {idField: 'id'});
  }

  getInstrumentById(instrumentId: string, category: string): Observable<any> {
    const instrumentRef = doc(this.firestore, `${category.toLowerCase()}/${instrumentId}`);
    return docData(instrumentRef);
  }
}

