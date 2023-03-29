import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Topic } from 'src/app/models/topic';

@Component({
  selector: 'app-topic-list-item',
  templateUrl: './topic-list-item.component.html',
  styleUrls: ['./topic-list-item.component.scss'],
})
export class TopicListItemComponent implements OnInit {
  @Input() topic: Topic
  @Output() onDelete: EventEmitter<Topic> = new EventEmitter();
  @Output() onUpdate: EventEmitter<Topic> = new EventEmitter();

  private currentUserId : string;
  private auth = inject(Auth);

  constructor(private router:Router) { }

  ngOnInit() {

    let currentUser = this.auth.currentUser;
    this.currentUserId = currentUser!.uid;
  }

  navigate(){
    this.router.navigate(['topics',this.topic.id])
  }

  isCreator(): boolean{
    return this.topic.creatorId == this.currentUserId;
  }

  isWriter(){
    return (this.currentUserId == this.topic.creatorId || this.topic!.writerIds.indexOf(this.currentUserId) >= 0)
  }

}
