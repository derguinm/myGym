import { Component, inject, OnInit } from '@angular/core';
import { TopicService } from 'src/app/services/topic.service';
import { Observable, EMPTY } from 'rxjs';
import { Topic } from 'src/app/models/topic';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.page.html',
  styleUrls: ['./topics-list.page.scss'],
})
export class TopicsListPage implements OnInit {



  search$: Observable<String> = EMPTY;
  topics$: Observable<Topic[]> = EMPTY;

  private topicService = inject(TopicService);
  private toastController = inject(ToastController);
  private modalCtrl = inject(ModalController);

  /**
   * Fetch all the topic during the ngOnInit hook
   */
  ngOnInit(): void {
    // this.topics$ = this.topicService.findAll().pipe(
    //   tap(console.log),
    //   switchMap(topics=>this.search$, (topics,search) =>
    //   topics.filter((t : Topic) => t.name.toLocaleUpperCase().includes(search.toLocaleUpperCase()))
    //   )
    // )

    this.topics$ = this.topicService.findAll()/*.pipe(
      tap(console.log),
      switchMap(topics=>this.search$.pipe(
        map(search => topics.filter((t : Topic) => t.name.toLocaleUpperCase().includes(search.toLocaleUpperCase())))
      ))
    )*/
  }

  /**
   * Method made to delete the given {Topic} and fetch the new list
   *
   * @param topic {Topic} the {Topic} to delete
   */
  delete(topic: Topic): void {
    this.topicService.delete(topic);
    this._fetchAllTopics();
  }

  /**
   * Method made to open the {CreateTopicComponent} in order to create a new {Topic}.
   *  - If the {CreateTopicComponent} is closed with the role `confirmed`,
   *  it creates a new Topic with the returned data and fetch the new list.
   *  - If the {CreateTopicComponent} is closed with the role `canceled`,
   *  it does nothing.
   */
  async openCreateTopicModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CreateTopicComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirmed') {
      this._createTopic(data);
      this._fetchAllTopics();
    }
  }

  /**
   * @private method to fetch all the {Topic}
   */
  private _fetchAllTopics(): void {
    this.topics$ = this.topicService.findAll();
  }

  // private search(value : any){
  //   this.search$.next(value)
  // }

  /**
   * @private method to create a new {Topic}
   *
   * @param topic {Topic} the {Topic} to add to the list
   */
  private async _createTopic(topic: Topic): Promise<void> {
    try {
      this.topicService.create(topic);

      const toast = await this.toastController.create({
        message: `Topic ${topic.name} successfully created`,
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });

      await toast.present();
    } catch (e) {
      const toast = await this.toastController.create({
        message: `Failed creating Topic ${topic.name}`,
        duration: 1500,
        position: 'bottom',
        color: 'danger'
      });

      await toast.present();
    }
  }

}
