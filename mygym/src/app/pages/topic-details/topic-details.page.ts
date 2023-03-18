import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import { BehaviorSubject, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { CreatePostComponent } from 'src/app/modals/create-post/create-post.component';
import { CreateTopicComponent } from 'src/app/modals/create-topic/create-topic.component';
import { Post } from 'src/app/models/post';
import { Topic } from 'src/app/models/topic';
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
  topic$: Observable<Topic | null >= EMPTY;
  topicId: string;

  private postService = inject(PostService);
  private topicService = inject(TopicService);
  private toastController = inject(ToastController);
  private modalCtrl = inject(ModalController);

  constructor(private route: ActivatedRoute){}

  /**
   * Fetch all the posts during the ngOnInit hook
   */
  ngOnInit(): void {
    this.search$ = this._search.asObservable();
    // this.topics$ = this.topicService.findAll().pipe(
    //   tap(console.log),
    //   switchMap(topics=>this.search$, (topics,search) =>
    //   topics.filter((t : Topic) => t.name.toLocaleUpperCase().includes(search.toLocaleUpperCase()))
    //   )
    // )
    this.topic$ = this.topicService.findOne(this.route.snapshot.paramMap.get('topicId')!);
    this.topic$.subscribe(topic => {
      this.topicId = topic!.id;
      this._fetchAllPosts()
    });
    this._fetchAllPosts()
  }

  /**
   * Method made to delete the given {Post} and fetch the new list
   *
   * @param post {Post} the {Post} to delete
   */
  delete(post: Post): void {
    this.postService.delete(this.topicId, post);
    this._fetchAllPosts();
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
      this._fetchAllPosts();
    }
  }

  /**
   * @private method to fetch all the {Posts}
   */
  private _fetchAllPosts(): void {
    this.posts$ = this.postService.findAll(this.topicId).pipe(
      tap(console.log),
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
        message: `Failed creating Topic ${post.name}`,
        duration: 1500,
        position: 'bottom',
        color: 'danger'
      });

      await toast.present();
    }
  }

}
