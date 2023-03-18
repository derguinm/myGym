import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, addDoc, CollectionReference, DocumentReference, deleteDoc} from '@angular/fire/firestore'
import { Post } from '../models/post';
import { Topic } from '../models/topic';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  private firestore = inject(Firestore);

  //l'observable qu'on utilisait avant le firestore :
  //private topics$: BehaviorSubject<Topic[]> = new BehaviorSubject([{id: '123', name: 'test', posts: []} as Topic, {id: '123', name: 'test', posts: []} as Topic]);

  /**
   * Method that returns all the topics
   *
   * @return An array of {Topic}
   */
  findAll(): Observable<Topic[]> {
    //avant firestore : return this.topics$.asObservable();

    //recuperation de tous les topics dans firebase :
    const collectionRef = collection(this.firestore, `topics`)
    return collectionData<any>(collectionRef, {idField: 'id'})

    //note pour plus tard :
    //si on met totos au lieu de topics ça recupere les totos dans la bdd
    //pour recuperer les posts d'un topics :
    //collection(this.firestore, `topics/${topicId}/posts`)
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
    //avant firestore:
    // let topics = this.topics$.value;
    // const newTopics = topics.concat(topic)
    // this.topics$.next(newTopics)

    //creation d'un topic dans firestore :
    const collectionRef = collection(this.firestore, `topics`) as CollectionReference<Topic>
    addDoc(collectionRef, topic)
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
    const documentRef = doc(this.firestore, `topics/${topic.id}`) as DocumentReference<Topic>;
    deleteDoc(documentRef);
  }
}
