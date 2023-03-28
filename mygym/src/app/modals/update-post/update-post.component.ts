import { Component, inject, Input, OnInit} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { map, Observable, tap } from 'rxjs';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
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
  @Input() users$: Observable<User[]>
  private postService = inject(PostService);
  private modalCtrl = inject(ModalController);

  constructor(private modalController: ModalController,
    private formBuilder: FormBuilder) {

  }

  public removeReader(post: Post, user: User){
    console.log(post.name + ' : remove reader : ')
    console.log(user)
  }

  public removeWritter(post: Post, user: User){
    console.log(post.name + ' : remove writer : ')
    console.log(user)
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
      map((users)=>users.filter((user)=>!(this.post.readers.includes(user) || this.post.creator == user))),
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
