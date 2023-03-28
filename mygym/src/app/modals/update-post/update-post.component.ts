import { Component, inject, Input, OnInit} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { filter, map, Observable } from 'rxjs';
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
  @Input() post: Post;
  @Input() users$: Observable<User[]>
  private postService = inject(PostService);
  modalCtrl: any;

  constructor(private modalController: ModalController,
    private formBuilder: FormBuilder) {

  }

  public removeReader(post: Post, user: User){
    console.log(post.name + ' : remove reader : ' + user.email)
    //est automatiquement supprimé des writters si besoin
  }

  public removeWritter(post: Post, user: User){
    console.log(post.name + ' : remove writer : ' + user.email)
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
    const modal = await this.modalCtrl.create({
      component: AddReadersToPostComponent,
      props:{
        users$: this.users$.pipe(
          map((users)=>users.filter((user)=>this.post.readers.includes(user)))
        )
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirmed') {
      this.addReaders(data);
    }
  }

  addReaders(data: any){
    console.log(data);
  }

}
