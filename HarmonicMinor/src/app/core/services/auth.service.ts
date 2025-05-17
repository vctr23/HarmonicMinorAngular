import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, UserCredential, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(public auth: Auth, private firestore: Firestore) {
    // Expect changes in the authentication state
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(() => {
        localStorage.setItem('sessionStartTime', new Date().toISOString());
      })
    );
  }

  register(username: string, email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password).then(async credential => {
      const userRef = doc(this.firestore, `users/${credential.user.uid}`);
      await setDoc(userRef, {
        uid: credential.user.uid,
        email,
        username,
        password
      });
      return credential;
    }));
  }


  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        localStorage.removeItem('sessionStartTime');
      })
    );
  }

  // Observable to get the current user
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  // Synchronous access to the current user
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getSessionStartTime(): Date | null {
    const sessionStartTime = localStorage.getItem('sessionStartTime');
    return sessionStartTime ? new Date(sessionStartTime) : null;
  }
}
