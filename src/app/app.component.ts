import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from './cache/local-storage.service';
import { User, UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'Admin of I Believe';
  isLoginUrl = false;
  user: User | null = null;
  constructor(
    private router: Router,
    private store: LocalStorageService,
    private userService: UserService
  ) {}
  ngOnInit() {
    this.router.events.subscribe((data) => {
      if (data instanceof NavigationEnd) {
        const url = data.url;
        this.isLoginUrl = url.includes('login');
        this.user = this.store.get('user')?.value;
      }
    });
  }
  logout() {
    if (this.user) {
      this.userService.logout(this.user?.userName);
      this.store.remove('user');
      this.router.navigateByUrl('/login');
    }
  }
}
