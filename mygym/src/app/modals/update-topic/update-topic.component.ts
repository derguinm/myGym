import { Component, inject, Input, OnInit} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { combineLatest, forkJoin, map, Observable, tap } from 'rxjs';
import { Post } from 'src/app/models/post';
import { Topic } from 'src/app/models/topic';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';
import { AddReadersToPostComponent } from '../add-readers-to-post/add-readers-to-post.component';
import { AddReadersToTopicComponent } from '../add-readers-to-topic/add-readers-to-topic.component';

@Component({
  selector: 'app-update-topic',
  templateUrl: './update-topic.component.html',
  styleUrls: ['./update-topic.component.scss'],
})
export class UpdateTopicComponent implements OnInit
{
  updateTopicForm!: FormGroup;
  @Input() topic: Topic;
  @Input() users$: Observable<User[]>
  public creator$ : Observable<User>
  public writers$ : Observable<User[]>
  public readers$ : Observable<User[]>
  private currentUserId: string;
  private topicService = inject(TopicService);
  private authService = inject(AuthService);
  private auth = inject(Auth);
  private modalCtrl = inject(ModalController);

  constructor(private modalController: ModalController,
    private formBuilder: FormBuilder) {

  }

  public removeReader(topic: Topic, user: User){
    //est automatiquement supprimé des writters si besoin
    this.topicService.removeReader(topic, user)
  }

  public removeWriter(topic: Topic, user: User){
    this.topicService.removeWriter(topic,  user)
  }

  /**
   * Getter for the {FormGroup} controls
   */
  get controls(): {
    [key: string]: AbstractControl<any, any>;
  } {
    return this.updateTopicForm.controls;
  }

  /**
   * Creates the {FormGroup} during the ngOnInit hook.
   * The {FormGroup} has the given controls :
   *
   * - name: a {string}, which should be not null and has a min length of 2.
   */
  ngOnInit() {
    // this.post$.pipe(
    //   map((post) => {
    //     return this.formBuilder.group({
    //       name: [post.name, [Validators.minLength(2)]],
    //       description: [post.description, []]
    //     })
    //   })
    // ).subscribe((updatePostForm) => {
    //   this.updatePostForm = updatePostForm
    // })

    let currentUser = this.auth.currentUser;
    this.currentUserId = currentUser!.uid;
    this.updateTopicForm = this.formBuilder.group({
            name: [this.topic.name, [Validators.minLength(2)]],
          })

    console.log("looking for creator at id : " + this.topic.creatorId)
    this.creator$ = this.authService.findOneUser(this.topic.creatorId);
    let readersArray: Observable<User>[] = [];
    this.topic.readerIds.forEach((id)=>{
      readersArray.push(this.authService.findOneUser(id))
    })
    //readersArray
    this.readers$ = combineLatest(readersArray).pipe(
      //tap(console.log)
    )

    let writersArray: Observable<User>[] = [];
    this.topic.writerIds.forEach((id)=>{
      writersArray.push(this.authService.findOneUser(id))
    })
    this.writers$ = combineLatest(writersArray)

    this.topicService.findOne(this.topic.id).subscribe((topic)=>{
      this.topic = topic

      let readersArray: Observable<User>[] = [];
    this.topic.readerIds.forEach((id)=>{
      readersArray.push(this.authService.findOneUser(id))
    })
    //readersArray
    this.readers$ = combineLatest(readersArray).pipe(
      //tap(console.log)
    )

    let writersArray: Observable<User>[] = [];
    this.topic.writerIds.forEach((id)=>{
      writersArray.push(this.authService.findOneUser(id))
    })
    this.writers$ = combineLatest(writersArray)
    }
      )

  }

  /**
   * Public method to dissmiss the modal
   *
   * @param post the {Post} to return
   * @param status the {string} of the status on how is closed the modal,
   * - it can be 'confirmed' if the modal is closed by a form submition.
   * - it can be 'canceled' if the modal is close by the close button.
   */
  dismissModal(topic: Topic | null, status: 'confirmed' | 'canceled') {
    this.modalController.dismiss(topic, status);
  }

  /**
   * Public method to update a {Post} and call the methods that will give close the modal
   * with the status 'confirmed' and the given {Post}
   */
  updateTopic(topic: Topic) {
    if (this.updateTopicForm.valid) {
      topic = {
        ...this.updateTopicForm.value,
        creatorId: topic.creatorId,
        writerIds: topic.writerIds,
        readerIds: topic.readerIds,
        id: topic.id
      }
      this.dismissModal(topic, 'confirmed');
    }
  }

  /**
   * Method made to open the {CreatePostComponent} in order to create a new {Post}.
   *  - If the {CreatePostComponent} is closed with the role `confirmed`,
   *  it creates a new Post with the returned data and fetch the new list.
   *  - If the {CreatePostComponent} is closed with the role `canceled`,
   *  it does nothing.
   */
  async openAddReadersModal(): Promise<void> {
    let potentialReaders: Observable<User[]> = this.users$.pipe(
      //@ts-ignore
      map((users)=>users.filter((user)=>!((this.topic.readerIds.indexOf(user.id) >= 0) || this.topic.creatorId == user.id))),
    )

    const modal = await this.modalCtrl.create({
      component: AddReadersToTopicComponent,
      componentProps:{
        users$: potentialReaders
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirmed') {
      this.addReaders(data);
    }
  }

  addReaders(datas: User[]){
    datas.forEach((data)=> this.topicService.addReader(this.topic, data))
    //this.postService.addWriter(this.topicId, this.post, data)
  }

  async openAddWritersModal(): Promise<void> {
    let potentialWriters: Observable<User[]> = this.users$.pipe(
      //@ts-ignore
      map((users)=>users.filter((user)=>!((this.topic.writerIds.indexOf(user.id) >= 0) || this.topic.creatorId == user.id))),
    )

    const modal = await this.modalCtrl.create({
      component: AddReadersToTopicComponent,
      componentProps:{
        users$: potentialWriters
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirmed') {
      this.addWriters(data);
    }
  }

  addWriters(datas: User[]){
    datas.forEach((data)=> this.topicService.addWriter(this.topic, data))
    //this.postService.addWriter(this.topicId, this.post, data)
  }

  isCreator(): boolean{
    return this.topic.creatorId == this.currentUserId;
  }

}
