import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopicDetailsPageRoutingModule } from './topic-details-routing.module';

import { TopicDetailsPage } from './topic-details.page';
import { SharedModule } from 'src/app/components/shared.module';
import { CreatePostComponent } from 'src/app/modals/create-post/create-post.component';
import { UpdatePostComponent } from 'src/app/modals/update-post/update-post.component';
import { AddReadersToPostComponent } from 'src/app/modals/add-readers-to-post/add-readers-to-post.component';

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TopicDetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [TopicDetailsPage, CreatePostComponent, UpdatePostComponent, AddReadersToPostComponent]
})
export class TopicDetailsPageModule {}
