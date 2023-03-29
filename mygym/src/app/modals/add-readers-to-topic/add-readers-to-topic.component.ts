import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-add-readers-to-topic',
  templateUrl: './add-readers-to-topic.component.html',
  styleUrls: ['./add-readers-to-topic.component.scss'],
})
export class AddReadersToTopicComponent implements OnInit {

  @Input() users$: Observable<User[]>

  private usersToAdd : User[];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.users$.subscribe((users)=>{console.log(users)})
  }

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
  addReaders() {
    console.log("on ajoute")
    console.log(this.usersToAdd)
    this.dismissModal(this.usersToAdd, 'confirmed');
  }

  //@ts-ignore
  handleChange(ev) {
    this.usersToAdd = ev.target.value;
  }


  compareWith(o1: any, o2: any) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((o) => o.id === o1.id);
    }

    return o1.id === o2.id;
  }

}
