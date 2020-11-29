import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

export interface User {
  userName: string;
  token: string;
}

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  postLogin(userName: string, password: string) {
    return this.http
      .post<User>('/admin/user', {
        username: userName,
        password,
      })
      .pipe(
        map((user: any) => ({
          token: user.token,
          userName: user.username,
        }))
      );
  }

  logout(userName: string) {
    return this.http.post<{ message: string }>('/admin/user/logout', {
      username: userName,
    });
  }
}
