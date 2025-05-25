import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { collection, collectionData, doc, docData, Firestore, increment } from '@angular/fire/firestore';
import { getDoc, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore) { }

  // Instruments
  getGuitarInstruments(): Observable<any> {
    const guitarsRef = collection(this.firestore, 'guitars');
    return collectionData(guitarsRef, { idField: 'id' });
  }

  getBassInstruments(): Observable<any> {
    const bassRef = collection(this.firestore, 'basses');
    return collectionData(bassRef, { idField: 'id' });
  }

  getDrumInstruments(): Observable<any> {
    const drumsRef = collection(this.firestore, 'drums');
    return collectionData(drumsRef, { idField: 'id' });
  }

  getPianoInstruments(): Observable<any> {
    const pianosRef = collection(this.firestore, 'pianos');
    return collectionData(pianosRef, { idField: 'id' });
  }

  getSoftwareInstruments(): Observable<any> {
    const softwareRef = collection(this.firestore, 'softwares');
    return collectionData(softwareRef, { idField: 'id' });
  }

  getWindInstruments(): Observable<any> {
    const windRef = collection(this.firestore, 'winds');
    return collectionData(windRef, { idField: 'id' });
  }

  getDjInstruments(): Observable<any> {
    const djRef = collection(this.firestore, 'djs');
    return collectionData(djRef, { idField: 'id' });
  }

  getMicrophoneInstruments(): Observable<any> {
    const microphoneRef = collection(this.firestore, 'microphones');
    return collectionData(microphoneRef, { idField: 'id' });
  }

  getInstrumentById(instrumentId: string, category: string): Observable<any> {
    const instrumentRef = doc(this.firestore, `${category.toLowerCase()}/${instrumentId}`);
    return docData(instrumentRef);
  }

  async updateStock(productId: string, category: string, change: number) {
    const ref = doc(this.firestore, `${category.toLowerCase()}/${productId}`);
    const snap = await getDoc(ref);
    let currentStock = 0;
    if(snap.exists()) {
      const data = snap.data();
      currentStock = parseInt(data['stock'], 10) || 0;
    }
    const newStock = (currentStock + change).toString();
    await updateDoc(ref, { stock: newStock });
  }
}
