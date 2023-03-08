import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopicsListPageRoutingModule } from './topics-list-routing.module';

import { TopicsListPage } from './topics-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // ReactiveFormsModule,
    IonicModule,
    TopicsListPageRoutingModule
  ],
  declarations: [TopicsListPage]
})
export class TopicsListPageModule {}
