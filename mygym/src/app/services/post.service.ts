import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

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
    return collectionData<any>(collectionRef, {idField: 'id'})

    //note pour plus tard :
    //si on met totos au lieu de topics ça recupere les totos dans la bdd
    //pour recuperer les posts d'un topics :
    //collection(this.firestore, `topics/${topicId}/posts`)
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


}
