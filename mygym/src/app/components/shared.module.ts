import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicListItemComponent } from './topic-list-item/topic-list-item.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PostListItemComponent } from './post-list-item/post-list-item.component';



@NgModule({
  declarations: [
    TopicListItemComponent,
    PostListItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports:[
    TopicListItemComponent,
    PostListItemComponent,
    CommonModule,
    FormsModule,
  ]
})
export class SharedModule { }
