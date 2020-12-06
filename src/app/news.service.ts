import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface NewsElement {
  title: string;
  transcript: string;
  cover: string;
  src: string;
}

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}
  getNews() {
    return this.http.get<{ list: Array<NewsElement> }>('/api/news');
  }
  crawlNews() {
    return this.http.post<{ message: string }>('/admin/crawl', {});
  }
  deleteNews(id: number) {
    return this.http.post<{ message: string }>('/admin/delete/news', {
      id,
    });
  }
  pushNews(id: number) {
    return this.http.post<{ message: string }>('/admin/send/news', {
      id,
    });
  }
}
