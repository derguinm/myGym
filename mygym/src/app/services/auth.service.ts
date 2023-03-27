import { inject, Injectable } from '@angular/core';
import {Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { doc,setDoc,addDoc,Firestore, CollectionReference, collection } from '@angular/fire/firestore';
import { user } from '../models/user';

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
}
