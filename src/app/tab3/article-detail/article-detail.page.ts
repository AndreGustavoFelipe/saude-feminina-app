import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-detail',
  templateUrl: 'article-detail.page.html',
  styleUrls: ['article-detail.page.scss'],
  standalone: false,
})
export class ArticleDetailPage implements OnInit {
  article: Article | null = null;
  safeBody: SafeHtml = '';
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private sanitizer: DomSanitizer,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadArticle(+id);
    }
  }

  loadArticle(id: number): void {
    this.isLoading = true;
    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.article = article;
        this.safeBody = this.sanitizer.bypassSecurityTrustHtml(article.body);
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.navCtrl.back();
  }
}
