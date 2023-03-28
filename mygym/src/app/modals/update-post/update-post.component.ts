import { Component, inject, Input, OnInit} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { combineLatest, forkJoin, map, Observable, tap } from 'rxjs';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { AddReadersToPostComponent } from '../add-readers-to-post/add-readers-to-post.component';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.scss'],
})
export class UpdatePostComponent implements OnInit
{
  updatePostForm!: FormGroup;
  @Input() topicId: string;
  @Input() post: Post;
  public post$ : Observable<Post>
  @Input() users$: Observable<User[]>
  public creator$ : Observable<User>
  public writers$ : Observable<User[]>
  public readers$ : Observable<User[]>
  private postService = inject(PostService);
  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);

  constructor(private modalController: ModalController,
    private formBuilder: FormBuilder) {

  }

  public removeReader(topicId: string, post: Post, user: User){
    //est automatiquement supprimé des writters si besoin
    console.log(user)
    this.postService.removeReader(topicId, post, user)
  }

  public removeWritter(topicId: string, post: Post, user: User){
    this.postService.removeWriter(topicId, post, user)
  }

  /**
   * Getter for the {FormGroup} controls
   */
  get controls(): {
    [key: string]: AbstractControl<any, any>;
  } {
    return this.updatePostForm.controls;
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
    this.updatePostForm = this.formBuilder.group({
            name: [this.post.name, [Validators.minLength(2)]],
            description: [this.post.description, []]
          })

    this.creator$ = this.authService.findOneUser(this.post.creatorId);
    let readersArray: Observable<User>[] = [];
    this.post.readerIds.forEach((id)=>{
      readersArray.push(this.authService.findOneUser(id))
    })
    //readersArray
    this.readers$ = combineLatest(readersArray).pipe(
      //tap(console.log)
    )

    let writersArray: Observable<User>[] = [];
    this.post.writerIds.forEach((id)=>{
      writersArray.push(this.authService.findOneUser(id))
    })
    this.writers$ = combineLatest(writersArray)

    this.postService.findOne(this.topicId, this.post.id).subscribe((post)=>{
      this.post = post

      let readersArray: Observable<User>[] = [];
    this.post.readerIds.forEach((id)=>{
      readersArray.push(this.authService.findOneUser(id))
    })
    //readersArray
    this.readers$ = combineLatest(readersArray).pipe(
      //tap(console.log)
    )

    let writersArray: Observable<User>[] = [];
    this.post.writerIds.forEach((id)=>{
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
  dismissModal(post: Post | null, status: 'confirmed' | 'canceled') {
    this.modalController.dismiss(post, status);
  }

  /**
   * Public method to update a {Post} and call the methods that will give close the modal
   * with the status 'confirmed' and the given {Post}
   */
  updatePost(post: Post) {
    if (this.updatePostForm.valid) {
      post = {
        ...this.updatePostForm.value,
        id: post.id
      }
      this.dismissModal(post, 'confirmed');
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
      map((users)=>users.filter((user)=>!((this.post.readerIds.indexOf(user.id) > 0) || this.post.creatorId == user.id))),
    )

    const modal = await this.modalCtrl.create({
      component: AddReadersToPostComponent,
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
    datas.forEach((data)=> this.postService.addReader(this.topicId,this.post, data))
    //this.postService.addWriter(this.topicId, this.post, data)
  }

}
