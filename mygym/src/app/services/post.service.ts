import { inject, Injectable } from '@angular/core';
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
    console.log(collectionData<any>(collectionRef, {idField: 'id'}).pipe(
      map((posts)=>this.mapPostsWithWriters(posts))
    ))
    //@ts-ignore
    return collectionData<any>(collectionRef, {idField: 'id'}).pipe(
      map((posts)=>this.mapPostsWithWriters(posts))
    )
  }

  mapPostsWithWriters(posts: Post[]) : Post[]{
    posts.map((post)=>{
//pour chaque post

      // //@ts-ignore
      // console.log(post.creator.path)
      // //collection users.pipe(indexof id)
      // //@ts-ignore
      // const userRef = doc(this.firestore, `${post.creator.path}`) as DocumentReference<User>
      //@ts-ignore
      let creator = getDoc(post.creator, {idField: 'id'})
      return {
        ...post,
        creator: creator
      }
    })

    return posts;
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

    const collectionRef = collection(this.firestore, `topics/${topicId}/posts`) as CollectionReference<Post>
    addDoc(collectionRef, post)
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
    const userRef = doc(this.firestore, `users/${writer.id}`) as DocumentReference<User>

    post.writers = post.writers.filter((user)=>!(userRef.path.indexOf(user.id) > -1))

    const documentRef = doc(this.firestore, `topics/${topicId}/posts/${post.id}`) as DocumentReference<User>
    updateDoc(documentRef, post);
  }

  removeReader(topicId: string, post: Post, reader: User){
    console.log('le reader :' + reader)
    const userRef = doc(this.firestore, `users/${reader.id}`) as DocumentReference<User>

    post.readers = post.readers.filter((user)=>!(userRef.path.indexOf(user.id) > -1))
    post.writers = post.writers.filter((user)=>!(userRef.path.indexOf(user.id) > -1))

    const documentRef = doc(this.firestore, `topics/${topicId}/posts/${post.id}`) as DocumentReference<User>
    updateDoc(documentRef, post);
  }

  addWriter(topicId: string, post: Post, writer: User){
    // const collectionRef = collection(this.firestore, `topics/${topicId}/posts/${post.id}/writers`) as CollectionReference<User>
    // addDoc(collectionRef, writer);

    const userRef = doc(this.firestore, `users/${writer.id}`) as DocumentReference<User>

    if(post.readers.filter((user)=>(userRef.path.indexOf(user.id) > -1)).length > 0){
      post.readers.push(userRef)
    }
    post.writers.push(userRef)

    const documentRef = doc(this.firestore, `topics/${topicId}/posts/${post.id}`) as DocumentReference<Post>;
    updateDoc(documentRef, post);
  }

  addReader(topicId: string, post: Post, reader: User){
    // const collectionRef = collection(this.firestore, `topics/${topicId}/posts/${post.id}/writers`) as CollectionReference<User>
    // addDoc(collectionRef, writer);

    const userRef = doc(this.firestore, `users/${reader.id}`) as DocumentReference<User>

    post.readers.push(userRef)

    const documentRef = doc(this.firestore, `topics/${topicId}/posts/${post.id}`) as DocumentReference<Post>;
    updateDoc(documentRef, post);
  }

}
