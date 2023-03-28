import { inject, Injectable } from '@angular/core';
import {Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { doc,setDoc,addDoc,Firestore, CollectionReference, collection, collectionData, DocumentReference, docData } from '@angular/fire/firestore';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';

type loginUser = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private fr  = inject(Firestore);
  constructor(private auth:Auth) {
    onAuthStateChanged
  }

  async register({ email, password, lastName,firstName}: loginUser){
    try{
      const userCredentials = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredentials.user.uid;
      console.log('uid',uid);
      console.log('m displaying firstname')
      console.log(firstName)
      console.log(lastName)
      await setDoc(doc(this.fr,'users',uid),{email,
        firstName,
        lastName
      })
       return userCredentials.user;
    }catch(e){
      console.error(e)
      return null;
    }
  }

  async login({ email, password}: loginUser){
    try{
      const user = await signInWithEmailAndPassword(this.auth,email,password);
      return user;
    }catch(e){
      return null;
    }
  }

  logout(){
    return signOut(this.auth);
  }

  /**
   * Method that returns all the topics
   *
   * @return An array of {Topic}
   */
  findAllUsers(): Observable<User[]> {
    //avant firestore : return this.topics$.asObservable();

    //recuperation de tous les topics dans firebase :
    const collectionRef = collection(this.fr, `users`) as CollectionReference<User>
    return collectionData<any>(collectionRef, {idField: 'id'}).pipe(tap(console.log))

    //note pour plus tard :
    //si on met totos au lieu de topics ça recupere les totos dans la bdd
    //pour recuperer les posts d'un topics :
    //collection(this.firestore, `topics/${topicId}/posts`)
  }

  findOneUser(id: string): Observable<User>{
    console.log("on recherche : " + id)
    const documentRef = doc(this.fr, `/users/${id}`) as DocumentReference<User>
    return docData<any>(documentRef, {idField: 'id'})
  }
}
