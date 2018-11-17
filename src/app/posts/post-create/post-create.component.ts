import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';


import { Post } from '../post.model';
import { PostService } from '../post.service';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

  enteredValue = '';
  enteredTitle = '';
  private mode: string;
  private postId: string;
  isLoading = false;
  form: FormGroup;
  post: Post;
  imagePreview: string;
  isAuthunticated = false;

  constructor(public postService: PostService, public route: ActivatedRoute, private authService: AuthService) {

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: mimeType})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe( post => {
          this.isLoading = false;
          this.post = {id: post._id, title: post.title, content: post.content, imagePath: post.imagePath, creator: null};
          this.form.setValue({'title': this.post.title, 'content': this.post.content, 'image': this.post.imagePath });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      const post: Post = {id: null, title: this.form.value.title, content: this.form.value.content, imagePath: null, creator: null};
      this.postService.addPost(post, this.form.value.image).subscribe( response => {
        this.isLoading = false;
        this.form.reset();
      }, error => {
        this.isLoading = false;
      });
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
      .subscribe( response => {
        this.isLoading = false;
        this.form.reset();
      }, error => {
        this.isLoading = false;
      });
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    console.log(file);
  }

}
