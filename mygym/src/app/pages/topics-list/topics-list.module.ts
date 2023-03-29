import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TopicsListPageRoutingModule } from './topics-list-routing.module';
import { TopicsListPage } from './topics-list.page';
import { CreateTopicComponent } from 'src/app/modals/create-topic/create-topic.component';
import { SharedModule } from 'src/app/components/shared.module';
import { UpdateTopicComponent } from 'src/app/modals/update-topic/update-topic.component';
import { AddReadersToTopicComponent } from 'src/app/modals/add-readers-to-topic/add-readers-to-topic.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TopicsListPageRoutingModule,
    SharedModule
  ],
  declarations: [TopicsListPage,CreateTopicComponent, UpdateTopicComponent, AddReadersToTopicComponent]
})
export class TopicsListPageModule {}
