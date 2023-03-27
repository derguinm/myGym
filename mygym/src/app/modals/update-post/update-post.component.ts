import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.scss'],
})
export class UpdatePostComponent implements OnInit {

  users:User[]
  updatePostForm!: FormGroup;
  @Input() post: Post;

  constructor(private modalController: ModalController,
    private formBuilder: FormBuilder) {

  }

  public removeReader(post: Post, user: User){
    console.log(post.name + ' : remove reader : ' + user.name)
    //est automatiquement supprimé des writters si besoin
  }

  public removeWritter(post: Post, user: User){
    console.log(post.name + ' : remove writer : ' + user.name)
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
    this.updatePostForm = this.formBuilder.group({
      name: [this.post.name, [Validators.minLength(2)]],
      description: [this.post.description, []]
    });
    this.users = [{id: '1', name: 'john'}, {id: '2', name: 'doe'}]
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
  updatePost() {
    if (this.updatePostForm.valid) {
      this.post = {
        ...this.updatePostForm.value,
        id: this.post.id
      }
      this.dismissModal(this.post, 'confirmed');
    }
  }

}
