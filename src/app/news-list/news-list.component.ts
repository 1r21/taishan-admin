import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmptyError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, NewsElement } from '../news.service';
import { LocalStorageService } from '../cache/local-storage.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
})
export class NewsListComponent implements OnInit {
  displayedColumns: string[] = ['no', 'title', 'summary', 'date', 'actions'];
  dataSource: NewsElement[] = [];
  isLoading = true;
  isCrawling = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private store: LocalStorageService,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this.getNews();
  }
  openDialog(news: NewsElement) {
    const localTheme = this.store.get('theme');
    this.dialog.open(NewsDetailDialog, {
      data: news,
      panelClass: localTheme?.value === 'dark' ? 'unicorn-dark-theme' : '',
    });
  }
  getNews() {
    this.isLoading = true;
    this.apiService.getNews().subscribe((result) => {
      const { list } = result;
      this.dataSource = list;
      this.isLoading = false;
    });
  }
  delete(id: number) {
    this.isLoading = true;
    this.apiService.deleteNews(id).subscribe(() => {
      this.getNews();
    });
  }
  push(id: number) {
    this.apiService.pushNews(id).subscribe();
  }
  crawling() {
    this.isCrawling = true;
    this.apiService
      .crawlNews()
      .pipe(
        catchError(() => {
          this.isCrawling = false;
          return EmptyError;
        })
      )
      .subscribe((result) => {
        this.getNews();
        this.snackBar.open(result.message);
        this.isCrawling = false;
      });
  }
}

@Component({
  selector: 'news-detail-dialog',
  templateUrl: './news-detail.dialog.html',
  styleUrls: ['./news-list.component.scss'],
})
export class NewsDetailDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: NewsElement
  ) {}
}
