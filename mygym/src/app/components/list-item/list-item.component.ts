import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Topic } from 'src/app/models/topic';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  // @ts-ignore
  @Input() topic: Topic
  @Output() onDelete: EventEmitter<Topic> = new EventEmitter();

  constructor(private router:Router) { }

  ngOnInit() {

  }

  navigate(){
    this.router.navigate(['topics',this.topic.id])
  }

}
