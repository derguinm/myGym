import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docData, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { getDoc } from '@firebase/firestore';
import { map, Observable, switchMap } from 'rxjs';
import { Post } from '../models/post';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private firestore = inject(Firestore);
  private auth = inject(Auth)

  /**
   * Method that returns all the topics
   *
   * @return An array of {Topic}
   */
  findAll(topicId: string): Observable<Post[]> {
    //avant firestore : return this.topics$.asObservable();

    //recuperation de tous les topics dans firebase :
    const collectionRef = collection(this.firestore, `topics/${topicId}/posts`) as CollectionReference<Post>
    //@ts-ignore
    return collectionData<any>(collectionRef, {idField: 'id'})
  }

  /**
   * Add a new {Post} to the list of {Post} of the {Topic} that match the given topicId
   *
   * @param topicId {string}, the id of the {Topic} we want to add the new {Post}
   * @param post {Post}, the new {Post} to add
   */
  create(topicId: string, post: Post) {
    //avant firestore :
    // const topics = this.topics$.value;
    // let topicIndex = topics.findIndex(t=>t.id === topicId)
    // if(topicIndex > -1) {
    //   topics[topicIndex].posts = topics[topicIndex]?.posts.concat(post);
    // }
    // this.topics$.next(topics)
    const currentUser = this.auth.currentUser;
    const uid  = currentUser?.uid;
    const updatedPost = {
      ...post,
      creatorId: uid,
      readerIds: [],
      writerIds: []
    }

    const collectionRef = collection(this.firestore, `topics/${topicId}/posts`)
    addDoc(collectionRef, updatedPost)
  }

  /**
   * update a {Post} from the list of {Post} of the {Topic} that match the given topicId
   *
   * @param topicId {string}, the id of the {Topic} we want to update the {Post}
   * @param post {Post}, the {Post} to update
   */
  update(topicId: string, post: Post): void {
    const documentRef = doc(this.firestore, `topics/${topicId}/posts/${post.id}`) as DocumentReference<Post>;
    updateDoc(documentRef, post);
  }

  /**
   * Remove a {Post} from the list of {Post} of the {Topic} that match the given topicId
   *
   * @param topicId {string}, the id of the {Topic} we want to remove the {Post}
   * @param post {Post}, the {Post} to remove
   */
  delete(topicId: string, post: Post): void {
    //avant firestore :
    // const topics = this.topics$.value;
    // const topicIndex = topics.findIndex(t=>t.id === topicId)
    // if(topicIndex > -1) {
    //   topics[topicIndex].posts = topics[topicIndex]?.posts.filter(p => p.id !== post.id);
    // }
    // this.topics$.next(topics)
    const documentRef = doc(this.firestore, `topics/${topicId}/posts/${post.id}`) as DocumentReference<Post>;
    deleteDoc(documentRef);
  }

  removeWriter(topicId: string, post: Post, writer: User){
    console.log('le writer :' + writer)

    post.writerIds = post.writerIds.filter((writerId)=>!(writerId == writer.id))

    const documentRef = doc(this.firestore, `topics/${topicId}/posts/${post.id}`) as DocumentReference<User>
    updateDoc(documentRef, post);
  }

  removeReader(topicId: string, post: Post, reader: User){
    // console.log('le reader :' + reader.id)

    post.readerIds = post.readerIds.filter((userId)=>!(userId == reader.id))
    post.writerIds = post.writerIds.filter((userId)=>!(userId == reader.id))

    // console.log("post :")
    // console.log(post)
    const documentRef = doc(this.firestore, `topics/${topicId}/posts/${post.id}`) as DocumentReference<User>
    updateDoc(documentRef, post);
  }

  findOne(topicId: string, postId: string): Observable<Post> {
    //avant firestore :
    // return (this.topics$).pipe(
    //   map(topics => topics.find(t =>t.id === id) ?? null)
    // )

    //recuperation d'un topic dans firebase par id :
    const documentRef = doc(this.firestore, `topics/${topicId}/posts/${postId}`)
    return docData<any>(documentRef, {idField: 'id'})
  }

  addWriter(topicId: string, post: Post, writer: User){
    // const collectionRef = collection(this.firestore, `topics/${topicId}/posts/${post.id}/writers`) as CollectionReference<User>
    // addDoc(collectionRef, writer);


    if(post.readerIds.indexOf(writer.id) < 0){
      post.readerIds.push(writer.id)
    }
    post.writerIds.push(writer.id)

    const documentRef = doc(this.firestore, `topics/${topicId}/posts/${post.id}`) as DocumentReference<Post>;
    updateDoc(documentRef, post);
  }

  addReader(topicId: string, post: Post, reader: User){
    // const collectionRef = collection(this.firestore, `topics/${topicId}/posts/${post.id}/writers`) as CollectionReference<User>
    // addDoc(collectionRef, writer);

    post.readerIds.push(reader.id)

    const documentRef = doc(this.firestore, `topics/${topicId}/posts/${post.id}`) as DocumentReference<Post>;
    updateDoc(documentRef, post);
  }

}
