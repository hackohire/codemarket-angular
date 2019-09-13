import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-like-dislike',
  templateUrl: './like-dislike.component.html',
  styleUrls: ['./like-dislike.component.scss']
})
export class LikeDislikeComponent implements OnInit {

  @Input() data;
  @Input() type: string;

  color: string;

  like: boolean;
  @Input() likeCount: number;

  constructor(
    public authService: AuthService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.authService.loggedInUser$.subscribe((u) => {
      if (u) {
        this.checkIfUserLikedAndLikeCount(u._id, this.data._id, this.type);
      }
    });
  }

  likeToggle(referenceId: string, liked: boolean) {
    const likeObj = {
      referenceId: referenceId,
      type: this.type,
      userId: this.authService.loggedInUser._id
    };
    this.productService.like(likeObj, liked).subscribe((d) => {
      this.like = d.liked;
      this.likeCount = d.likeCount;
    });
  }

  checkIfUserLikedAndLikeCount(userId, referenceId, type) {
    this.productService.checkIfUserLikedAndLikeCount(userId, referenceId, type).subscribe(l => {
      this.likeCount = l.likeCount;
      this.like = l.liked;
    });
  }

}
