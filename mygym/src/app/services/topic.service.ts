import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, of, filter } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, addDoc, CollectionReference, DocumentReference, deleteDoc, DocumentData, getDoc} from '@angular/fire/firestore'
import { Post } from '../models/post';
import { Topic } from '../models/topic';
import { Auth } from '@angular/fire/auth';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  private firestore = inject(Firestore);
  private auth = inject(Auth)

  //l'observable qu'on utilisait avant le firestore :
  //private topics$: BehaviorSubject<Topic[]> = new BehaviorSubject([{id: '123', name: 'test', posts: []} as Topic, {id: '123', name: 'test', posts: []} as Topic]);

  /**
   * Method that returns all the topics
   *
   * @return An array of {Topic}
   */
  findAll(): Observable<any> {

    const uid = this.auth.currentUser?.uid;
    const collectionRef = collection(this.firestore, `topics`)
    return of(uid).pipe(
      switchMap(uid => {
        return collectionData<any>(collectionRef, {idField: 'id'}).pipe(
          map(topics => {
            return topics.filter(topic =>  topic.creator.path.indexOf(uid) >= 0)
             })
        )})
    )
  }

  private async mapTopicsWithCreator(topics: DocumentData[]) {
    return await Promise.all(topics.map(async (topic) => {
      console.log(topic)
      const path = topic['creator'].path;
      const topicDoc = await getDoc(doc(this.firestore, path));
      const creator = await topicDoc.data() as User;
      console.log(creator)
      return {
        ...topic,
        creator
      };
    }));
  }


  /**
   * Method that returns the topic which match the given id
   *
   * @param id {string} the given id
   * @return A {Topic}
   */
  findOne(id: string): Observable<Topic | null> {
    //avant firestore :
    // return (this.topics$).pipe(
    //   map(topics => topics.find(t =>t.id === id) ?? null)
    // )

    //recuperation d'un topic dans firebase par id :
    const documentRef = doc(this.firestore, `topics/${id}`)
    return docData<any>(documentRef, {idField: 'id'})
  }

  /**
   * Add a new {Topic} to the list
   *
   * @param topic {Topic}, the {Topic} to add to the list
   */
  create(topic: Topic): void {
    const currentUser = this.auth.currentUser;
    const uid  = currentUser?.uid;
    const userRef = doc(this.firestore,`users/${uid}`);
    const updatedTopic = {
      ...topic,
      creator: userRef
    }

    //creation d'un topic dans firestore :
    const collectionRef = collection(this.firestore, `topics`)
    addDoc(collectionRef, updatedTopic)
  }

  /**
   * Remove a {Topic} from the list
   *
   * @param topic {Topic}, the {Topic} to remove from the list
   */
  delete(topic: Topic): void {
    //avant firestore:
    // const topics = this.topics$.value
    // const newTopics = topics.filter(t => t.id !== topic.id)
    // this.topics$.next(newTopics)

    //suppression d'un topic dans firestore :
    if( topic!.creator!.email !== this.auth.currentUser?.email){
      return;
    }
    const documentRef = doc(this.firestore, `topics/${topic.id}`) as DocumentReference<Topic>;

    deleteDoc(documentRef);
  }
}
