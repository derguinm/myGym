import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicListItemComponent } from './topic-list-item/topic-list-item.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TopicListItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports:[
    TopicListItemComponent,
    CommonModule,
    FormsModule,
  ]
})
export class SharedModule { }
