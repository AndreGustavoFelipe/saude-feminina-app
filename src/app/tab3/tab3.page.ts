import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../services/article.service';
import { Article, Category } from '../models/article.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  categories: Category[] = [];
  articles: Article[] = [];
  selectedCategoryId: number | undefined;
  isLoading = true;
  hasError = false;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.articleService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadArticles();
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  loadArticles(): void {
    this.isLoading = true;
    this.hasError = false;
    this.articleService.getPublishedArticles(this.selectedCategoryId).subscribe({
      next: (articles) => {
        this.articles = articles;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  selectCategory(categoryId?: number): void {
    this.selectedCategoryId = categoryId;
    this.loadArticles();
  }

  openArticle(article: Article): void {
    this.router.navigate(['/tabs/tab3/article', article.id]);
  }

  getExcerpt(html: string): string {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }

  retry(): void {
    this.loadCategories();
  }
}
