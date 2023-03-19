import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss'],
})
export class PostListItemComponent implements OnInit {

  @Input() post: Post
  @Output() onDelete: EventEmitter<Post> = new EventEmitter();
  @Output() onUpdate: EventEmitter<Post> = new EventEmitter();

  constructor(private router:Router) { }

  ngOnInit() {

  }

  navigate(){
    this.router.navigate([this.router.url + '/posts',this.post.id])
  }

}
