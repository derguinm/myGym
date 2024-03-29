import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import { BehaviorSubject, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { CreatePostComponent } from 'src/app/modals/create-post/create-post.component';
import { UpdatePostComponent } from 'src/app/modals/update-post/update-post.component';
import { Post } from 'src/app/models/post';
import { Auth } from '@angular/fire/auth';
import { Topic } from 'src/app/models/topic';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.page.html',
  styleUrls: ['./topic-details.page.scss'],
})
export class TopicDetailsPage implements OnInit {

  search$: Observable<String> = EMPTY;
  _search: BehaviorSubject<string> = new BehaviorSubject("");
  posts$: Observable<Post[]> = EMPTY;
  users$: Observable<User[]> = EMPTY;
  topic$: Observable<Topic | null >= EMPTY;
  topicId: string;
  topic: Topic | null;

  private currentUserId: string;
  private postService = inject(PostService);
  private authService = inject(AuthService);
  private auth = inject(Auth)
  private topicService = inject(TopicService);
  private toastController = inject(ToastController);
  private modalCtrl = inject(ModalController);

  constructor(private route: ActivatedRoute){}

  /**
   * Fetch all the posts during the ngOnInit hook
   */
  ngOnInit(): void {
    let currentUser = this.auth.currentUser;
    this.currentUserId = currentUser!.uid;
    this.search$ = this._search.asObservable();
    // this.topics$ = this.topicService.findAll().pipe(
    //   tap(console.log),
    //   switchMap(topics=>this.search$, (topics,search) =>
    //   topics.filter((t : Topic) => t.name.toLocaleUpperCase().includes(search.toLocaleUpperCase()))
    //   )
    // )
    this.topic$ = this.topicService.findOne(this.route.snapshot.paramMap.get('topicId')!);
    this.topic$.subscribe((topic)=>{
      this.topic = topic;
    })
    this.topicId = this.route.snapshot.paramMap.get('topicId')!
    this._fetchAllPosts()
    this.users$ = this.authService.findAllUsers()//.pipe(tap(console.log))
  }

  /**
   * Method made to delete the given {Post} and fetch the new list
   *
   * @param post {Post} the {Post} to delete
   */
  delete(post: Post): void {
    this.postService.delete(this.topicId, post);
  }

  /**
   * Method made to open the {CreatePostComponent} in order to create a new {Post}.
   *  - If the {CreatePostComponent} is closed with the role `confirmed`,
   *  it creates a new Post with the returned data and fetch the new list.
   *  - If the {CreatePostComponent} is closed with the role `canceled`,
   *  it does nothing.
   */
  async openCreatePostModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CreatePostComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirmed') {
      this._createPost(data);
    }
  }

  async openUpdatePostModal(post: Post): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: UpdatePostComponent,
      componentProps: {
        post: post,
        users$: this.users$,
        topic: this.topic
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirmed') {
      this._updatePost(data);
    }
  }

  /**
   * @private method to update a {Post}
   *
   * @param post {Post} the {Post} to put to the list
   */
  private async _updatePost(post: Post): Promise<void> {
    try {
      this.postService.update(this.topicId, post);

      const toast = await this.toastController.create({
        message: `Program successfully updated`,
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });

      await toast.present();
    } catch (e) {
      const toast = await this.toastController.create({
        message: `Failed updating program`,
        duration: 1500,
        position: 'bottom',
        color: 'danger'
      });

      await toast.present();
    }
  }

  /**
   * @private method to fetch all the {Posts}
   */
  private _fetchAllPosts(): void {
    this.posts$ = this.postService.findAll(this.topicId).pipe(
      //tap(console.log),
      switchMap(posts=>this.search$.pipe(
        map(search => posts.filter((p : Post) => p.name.toLocaleUpperCase().includes(search.toLocaleUpperCase()) || p.description.toLocaleUpperCase().includes(search.toLocaleUpperCase())))
      ))
    )
  }

  search(value : any){
    this._search.next(value)
  }

  /**
   * @private method to create a new {Post}
   *
   * @param post {Post} the {Post} to add to the list
   */
  private async _createPost(post: Post): Promise<void> {
    try {
      this.postService.create(this.topicId, post);

      const toast = await this.toastController.create({
        message: `Post ${post.name} successfully created`,
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });

      await toast.present();
    } catch (e) {
      const toast = await this.toastController.create({
        message: `Failed creating Post ${post.name}`,
        duration: 1500,
        position: 'bottom',
        color: 'danger'
      });

      await toast.present();
    }
  }

  isWriter(){
    return (typeof this.topic != 'undefined') && (this.currentUserId == this.topic?.creatorId || this.topic!.writerIds.indexOf(this.currentUserId) >= 0)
  }
}
