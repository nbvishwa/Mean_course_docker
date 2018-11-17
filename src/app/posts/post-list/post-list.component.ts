import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PostService } from '../post.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;
  private authSubsStat: Subscription;
  userId: string;
  isAuthenticated = false;
  isLoading = false;
  totalPosts = 0;
  postPerPage = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 3, 5, 10];

  constructor(public postservice: PostService, private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postservice.getPosts(this.postPerPage, this.currentPage);
    this.postsSub =  this.postservice.getPostUpdateListner()
    .subscribe((postsData: {posts: Post[], maxPost: number}) => {
      this.posts = postsData.posts;
      this.totalPosts = postsData.maxPost;
      this.isLoading = false;
    });
    this.isAuthenticated = this.authService.getAuthStatus();
    this.authSubsStat = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(post: Post) {
    this.isLoading = true;
    this.postservice.deletePost(post).subscribe(() => {
      this.postservice.getPosts(this.postPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postservice.getPosts(this.postPerPage, this.currentPage);
  }

}
