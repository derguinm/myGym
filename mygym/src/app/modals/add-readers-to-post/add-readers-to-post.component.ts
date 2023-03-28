import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-add-readers-to-post',
  templateUrl: './add-readers-to-post.component.html',
  styleUrls: ['./add-readers-to-post.component.scss'],
})
export class AddReadersToPostComponent implements OnInit {

  @Input() users: Observable<User[]>

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  /**
   * Public method to dissmiss the modal
   *
   * @param readers the {User[]} to return
   * @param status the {string} of the status on how is closed the modal,
   * - it can be 'confirmed' if the modal is closed by a form submition.
   * - it can be 'canceled' if the modal is close by the close button.
   */
  dismissModal(readers: User[] | null, status: 'confirmed' | 'canceled') {
    this.modalController.dismiss(readers, status);
  }

  /**
   * Public method to create a {Topic} and call the methods that will give close the modal
   * with the status 'confirmed' and the given {Topic}
   */
  addReaders(readers: User[]) {
    this.dismissModal(readers, 'confirmed');
  }

}
