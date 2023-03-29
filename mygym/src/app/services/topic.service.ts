import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, of, filter } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, addDoc, CollectionReference, DocumentReference, deleteDoc, DocumentData, getDoc, updateDoc} from '@angular/fire/firestore'
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
            return topics.filter(topic =>  (topic.creatorId == uid || topic.readerIds.indexOf(uid) >= 0))
             })
        )})
    )
  }


  /**
   * Method that returns the topic which match the given id
   *
   * @param id {string} the given id
   * @return A {Topic}
   */
  findOne(id: string): Observable<Topic> {
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
    const updatedTopic = {
      ...topic,
      creatorId: uid,
      readerIds: [],
      writerIds: []
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
    const documentRef = doc(this.firestore, `topics/${topic.id}`) as DocumentReference<Topic>;

    deleteDoc(documentRef);
  }

  addWriter(topic: Topic, writer: User){
    // const collectionRef = collection(this.firestore, `topics/${topicId}/posts/${post.id}/writers`) as CollectionReference<User>
    // addDoc(collectionRef, writer);

    // console.log("id du writer a ajouter : ")
    // console.log(writer.id)
    if(topic.readerIds.indexOf(writer.id) < 0){
      topic.readerIds.push(writer.id)
    }
    topic.writerIds.push(writer.id)

    const documentRef = doc(this.firestore, `topics/${topic.id}`) as DocumentReference<Topic>;
    updateDoc(documentRef, topic);
  }

  addReader(topic: Topic, reader: User){
    // const collectionRef = collection(this.firestore, `topics/${topicId}/posts/${post.id}/writers`) as CollectionReference<User>
    // addDoc(collectionRef, writer);


    topic.readerIds.push(reader.id)

    const documentRef = doc(this.firestore, `topics/${topic.id}`) as DocumentReference<Topic>;
    updateDoc(documentRef, topic);
  }

  update(topic: Topic): void {
    const documentRef = doc(this.firestore, `topics/${topic.id}`) as DocumentReference<Topic>;
    updateDoc(documentRef, topic);
  }

  removeWriter(topic: Topic, writer: User){
    console.log('le writer :' + writer)

    topic.writerIds = topic.writerIds.filter((writerId)=>!(writerId == writer.id))

    const documentRef = doc(this.firestore, `topics/${topic.id}`) as DocumentReference<Topic>
    updateDoc(documentRef, topic);
  }

  removeReader(topic: Topic, reader: User){
    // console.log('le reader :' + reader.id)

    topic.readerIds = topic.readerIds.filter((userId)=>!(userId == reader.id))
    topic.writerIds = topic.writerIds.filter((userId)=>!(userId == reader.id))

    // console.log("post :")
    // console.log(post)
    const documentRef = doc(this.firestore, `topics/${topic.id}`) as DocumentReference<Topic>
    updateDoc(documentRef, topic);
  }
}
