import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  constructor(private router:Router) { }

  ngOnInit() {

  }

  navigate(){
    this.router.navigate(['topics',this.topic.id])
  }

}
