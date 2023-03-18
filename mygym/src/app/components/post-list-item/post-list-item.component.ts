import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss'],
})
export class PostListItemComponent implements OnInit {
  // @ts-ignore
  @Input() post: Post
  @Output() onDelete: EventEmitter<Post> = new EventEmitter();

  constructor(private router:Router) { }

  ngOnInit() {

  }

  navigate(){
    this.router.navigate(['posts',this.post.id])
  }

}
