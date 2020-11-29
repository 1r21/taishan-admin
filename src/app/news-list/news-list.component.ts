import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmptyError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService, NewsElement } from '../news.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.less'],
})
export class NewsListComponent implements OnInit {
  displayedColumns: string[] = ['no', 'title', 'actions'];
  dataSource: NewsElement[] = [];
  isLoading = true;
  isCrawling = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this.getNews();
  }
  openDialog(news: NewsElement) {
    this.dialog.open(NewsDetailDialog, {
      data: news,
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
  styleUrls: ['./news-list.component.less'],
})
export class NewsDetailDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: NewsElement
  ) {}
}
