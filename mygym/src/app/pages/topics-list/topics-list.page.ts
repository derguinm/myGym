import { Component, inject, OnInit } from '@angular/core';
import { TopicService } from 'src/app/services/topic.service';
import { Observable, EMPTY, tap, switchMap, map, BehaviorSubject } from 'rxjs';
import { Topic } from 'src/app/models/topic';
import { ModalController, ToastController } from '@ionic/angular';
import { CreateTopicComponent } from 'src/app/modals/create-topic/create-topic.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UpdateTopicComponent } from 'src/app/modals/update-topic/update-topic.component';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.page.html',
  styleUrls: ['./topics-list.page.scss'],
})
export class TopicsListPage implements OnInit {

  search$: Observable<String> = EMPTY;
  _search: BehaviorSubject<string> = new BehaviorSubject("");
  topics$: Observable<Topic[]> = EMPTY;
  users$: Observable<User[]> = EMPTY;

  private topicService = inject(TopicService);
  private toastController = inject(ToastController);
  private modalCtrl = inject(ModalController);
  private AuthServ = inject(AuthService);
  private router = inject(Router)
  /**
   * Fetch all the topic during the ngOnInit hook
   */
  ngOnInit(): void {
    this.search$ = this._search.asObservable();
    this.users$ = this.AuthServ.findAllUsers()
    // this.topics$ = this.topicService.findAll().pipe(
    //   tap(console.log),
    //   switchMap(topics=>this.search$, (topics,search) =>
    //   topics.filter((t : Topic) => t.name.toLocaleUpperCase().includes(search.toLocaleUpperCase()))
    //   )
    // )

    this._fetchAllTopics()
  }

  /**
   * Method made to delete the given {Topic} and fetch the new list
   *
   * @param topic {Topic} the {Topic} to delete
   */
  delete(topic: Topic): void {
    this.topicService.delete(topic);
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
    }
  }

  async openUpdateTopicModal(topic: Topic): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: UpdateTopicComponent,
      componentProps: {
        topic: topic,
        users$: this.users$,
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirmed') {
      this._updateTopic(data);
    }
  }

  private async _updateTopic(topic: Topic): Promise<void> {
    try {
      this.topicService.update(topic);

      const toast = await this.toastController.create({
        message: `Category successfully updated`,
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });

      await toast.present();
    } catch (e) {
      const toast = await this.toastController.create({
        message: `Failed updating category`,
        duration: 1500,
        position: 'bottom',
        color: 'danger'
      });

      await toast.present();
    }
  }

  /**
   * @private method to fetch all the {Topic}
   */
  private _fetchAllTopics(): void {
    this.topics$ = this.topicService.findAll().pipe(
      //tap(console.log),
      switchMap(topics=>this.search$.pipe(
        //tap(console.log),
        map(search => topics.filter((t : Topic) => t.name.toLocaleUpperCase().includes(search.toLocaleUpperCase())))
      ))
    )
  }

  search(value : any){
    this._search.next(value)
  }

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

  async logout(){
    this.AuthServ.logout();
    this.router.navigateByUrl('', {replaceUrl: true})
  }

}
