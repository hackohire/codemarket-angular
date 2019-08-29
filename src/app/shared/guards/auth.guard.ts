import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canLoad() {
    return Auth.currentAuthenticatedUser().then(() => {
      return true;
    }).catch(() => {
      this.router.navigate(['/']);
      return false;
    });


  }

}
 