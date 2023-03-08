import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Topic } from 'src/app/models/topic';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss'],
})
export class CreateTopicComponent implements OnInit {

  createTopicForm!: FormGroup;

  constructor(private modalController: ModalController,
    private formBuilder: FormBuilder) {

  }

  /**
   * Getter for the {FormGroup} controls
   */
  get controls(): {
    [key: string]: AbstractControl<any, any>;
  } {
    return this.createTopicForm.controls;
  }

  /**
   * Creates the {FormGroup} during the ngOnInit hook.
   * The {FormGroup} has the given controls :
   *
   * - name: a {string}, which should be not null and has a min length of 2.
   */
  ngOnInit() {
    this.createTopicForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  /**
   * Public method to dissmiss the modal
   *
   * @param topic the {Topic} to return
   * @param status the {string} of the status on how is closed the modal,
   * - it can be 'confirmed' if the modal is closed by a form submition.
   * - it can be 'canceled' if the modal is close by the close button.
   */
  dismissModal(topic: Topic | null, status: 'confirmed' | 'canceled') {
    this.modalController.dismiss(topic, status);
  }

  /**
   * Public method to create a {Topic} and call the methods that will give close the modal
   * with the status 'confirmed' and the given {Topic}
   */
  createTopic() {
    if (this.createTopicForm.valid) {
      const topic: Topic = {
        ...this.createTopicForm.value,
        id: Date.now().toString() + (Math.random() * 100).toFixed(),
        posts: []
      };
      this.dismissModal(topic, 'confirmed');
    }
  }
}
