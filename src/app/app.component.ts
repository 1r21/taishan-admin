import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from './cache/local-storage.service';
import { User, UserService } from './user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Admin of I Believe';
  isLoginUrl = false;
  user: User | null = null;
  isDarkTheme = false;

  constructor(
    private router: Router,
    private store: LocalStorageService,
    private userService: UserService
  ) {}
  ngOnInit() {
    const localTheme = this.store.get('theme');
    this.isDarkTheme = localTheme?.value === 'dark';
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (event) => {
          this.isDarkTheme = event.matches;
          this.storeTheme();
        });
    }

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
  storeTheme() {
    if (this.isDarkTheme) {
      this.store.set('theme', {
        value: 'dark',
      });
    } else {
      this.store.remove('theme');
    }
  }
  changeTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.storeTheme();
  }
}
