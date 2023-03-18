import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopicDetailsPageRoutingModule } from './topic-details-routing.module';

import { TopicDetailsPage } from './topic-details.page';
import { SharedModule } from 'src/app/components/shared.module';
import { CreatePostComponent } from 'src/app/modals/create-post/create-post.component';

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TopicDetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [TopicDetailsPage, CreatePostComponent]
})
export class TopicDetailsPageModule {}
