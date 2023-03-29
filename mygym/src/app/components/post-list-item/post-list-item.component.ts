import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
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
  private currentUserId : string;
  private auth = inject(Auth);

  constructor(private router:Router) { }

  ngOnInit() {

    let currentUser = this.auth.currentUser;
    this.currentUserId = currentUser!.uid;
  }

  navigate(){
    this.router.navigate([this.router.url + '/posts',this.post.id])
  }

  isWriter(){
    return (this.currentUserId == this.post.creatorId || this.post!.writerIds.indexOf(this.currentUserId) >= 0)
  }

  isCreator(): boolean{
    return this.post.creatorId == this.currentUserId;
  }

}
