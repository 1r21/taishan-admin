import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../user.service';
import { LocalStorageService } from '../cache/local-storage.service';
import { catchError } from 'rxjs/operators';
import { EmptyError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit, DoCheck {
  canSubmitted = false;
  isLoading = false;
  userName = '';
  password = '';
  errorMsg = '';

  constructor(
    private router: Router,
    private store: LocalStorageService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const userInfo = this.store.get('user');
    if (userInfo) {
      this.router.navigateByUrl('/news');
    }
  }

  ngDoCheck(): void {
    this.canSubmitted = Boolean(this.userName) && Boolean(this.password);
  }

  onSubmit() {
    /**
     * Innocent until proven guilty
     */
    this.isLoading = true;
    this.userService
      .postLogin(this.userName, this.password)
      .pipe(
        catchError(() => {
          this.isLoading = false;
          return EmptyError;
        })
      )
      .subscribe((user: User) => {
        console.log(user);
        this.store.set('user', {
          value: user,
        });
        this.router.navigateByUrl('/news');
        this.errorMsg = '';
        this.isLoading = false;
      });
  }
}
