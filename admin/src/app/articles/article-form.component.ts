import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';
import { ArticleService } from '../services/article.service';
import { CategoryService } from '../services/category.service';
import { TagService } from '../services/tag.service';
import { LifePhaseService } from '../services/life-phase.service';
import { Article } from '../models/article.model';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';
import { LifePhase } from '../models/life-phase.model';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatCardModule,
    QuillModule
  ],
  template: `
    <div class="page-header">
      <h1>{{ isEditMode ? 'Editar Artigo' : 'Novo Artigo' }}</h1>
      <button mat-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon> Voltar
      </button>
    </div>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="article-form">
      <mat-card>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Título</mat-label>
            <input matInput formControlName="title" placeholder="Título do artigo">
            <mat-error *ngIf="form.get('title')?.hasError('required')">Título é obrigatório</mat-error>
          </mat-form-field>

          <div class="form-section editor-section">
            <label class="section-label">Corpo do Artigo</label>
            <quill-editor
              #editorComponent
              formControlName="body"
              [modules]="quillModules"
              [styles]="{ height: '500px' }"
              placeholder="Escreva o conteúdo do artigo..."
              (onEditorCreated)="onEditorCreated($event)">
            </quill-editor>
            <p class="editor-hint">Use a barra de ferramentas para inserir imagens e vídeos diretamente no conteúdo.</p>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Categoria</mat-label>
              <mat-select formControlName="category_id">
                <mat-option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('category_id')?.hasError('required')">Categoria é obrigatória</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fase de Vida</mat-label>
              <mat-select formControlName="life_phase_id">
                <mat-option [value]="null">Nenhuma</mat-option>
                <mat-option *ngFor="let phase of lifePhases" [value]="phase.id">{{ phase.name }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tags</mat-label>
            <mat-select formControlName="tag_ids" multiple>
              <mat-option *ngFor="let tag of tags" [value]="tag.id">{{ tag.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Ordem de Exibição</mat-label>
              <input matInput type="number" formControlName="display_order">
            </mat-form-field>

            <div class="toggle-container">
              <mat-slide-toggle formControlName="published" color="primary">
                {{ form.get('published')?.value ? 'Publicado' : 'Rascunho' }}
              </mat-slide-toggle>
            </div>
          </div>

          <div class="form-section">
            <label class="section-label">Imagem de Capa</label>
            <div class="image-upload">
              <input type="file" #fileInput accept="image/jpeg,image/png,image/webp,image/gif" (change)="onFileSelected($event)" hidden>
              <button mat-stroked-button type="button" (click)="fileInput.click()">
                <mat-icon>upload</mat-icon> Selecionar Imagem
              </button>
              <span *ngIf="selectedFileName" class="file-name">{{ selectedFileName }}</span>
              <button *ngIf="selectedFile" mat-icon-button type="button" (click)="removeSelectedImage()" aria-label="Remover imagem">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <p class="upload-hint">Formatos aceitos: JPEG, PNG, WebP, GIF. Tamanho máximo: 2MB.</p>
            <p *ngIf="imageError" class="image-error">{{ imageError }}</p>
            <div *ngIf="imagePreview" class="image-preview">
              <img [src]="imagePreview" alt="Preview da imagem de capa">
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button type="button" (click)="goBack()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || isSubmitting || !!imageError">
            {{ isSubmitting ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Criar') }}
          </button>
        </mat-card-actions>
      </mat-card>
    </form>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    h1 { margin: 0; }
    .article-form { max-width: 1200px; width: 100%; margin-bottom: 48px; }
    .full-width { width: 100%; }
    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .form-row mat-form-field { flex: 1; }
    .form-section {
      margin-bottom: 24px;
    }
    .editor-section {
      margin-bottom: 32px;
    }
    .editor-section quill-editor {
      display: block;
      width: 100%;
    }
    :host ::ng-deep .ql-container {
      min-height: 500px;
      font-size: 16px;
    }
    :host ::ng-deep .ql-editor {
      min-height: 500px;
    }
    :host ::ng-deep .ql-editor img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 12px 0;
    }
    :host ::ng-deep .ql-editor iframe {
      width: 100%;
      min-height: 400px;
      border-radius: 8px;
      margin: 12px 0;
    }
    :host ::ng-deep .ql-toolbar {
      border-radius: 8px 8px 0 0;
      background: #fafafa;
    }
    :host ::ng-deep .ql-container {
      border-radius: 0 0 8px 8px;
    }
    .editor-hint {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
      margin-top: 8px;
    }
    .section-label {
      display: block;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 8px;
    }
    .toggle-container {
      display: flex;
      align-items: center;
      padding-top: 16px;
    }
    .image-upload {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .file-name {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
    }
    .upload-hint {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
      margin-top: 6px;
    }
    .image-error {
      font-size: 13px;
      color: #d32f2f;
      margin-top: 6px;
    }
    .image-preview {
      margin-top: 12px;
    }
    .image-preview img {
      max-width: 300px;
      max-height: 200px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }
    mat-card-actions {
      padding: 16px !important;
      margin-bottom: 32px;
    }
  `]
})
export class ArticleFormComponent implements OnInit {
  @ViewChild('editorComponent') editorComponent!: QuillEditorComponent;

  form!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  articleId: number | null = null;
  categories: Category[] = [];
  tags: Tag[] = [];
  lifePhases: LifePhase[] = [];
  selectedFile: File | null = null;
  selectedFileName = '';
  imagePreview: string | null = null;
  imageError: string | null = null;

  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  quillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': [1, 2, 3, false] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['blockquote'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        'image': () => this.insertImage(),
        'video': () => this.insertVideo()
      }
    }
  };

  private quillEditor: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private lifePhaseService: LifePhaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSelectData();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.articleId = +id;
      this.loadArticle(this.articleId);
    }
  }

  onEditorCreated(editor: any): void {
    this.quillEditor = editor;
  }

  insertImage(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.snackBar.open('Formato de imagem não suportado. Use JPEG, PNG, WebP ou GIF.', 'Fechar', { duration: 4000 });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Imagem muito grande para inserir no corpo. Máximo: 5MB.', 'Fechar', { duration: 4000 });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const range = this.quillEditor.getSelection(true);
        this.quillEditor.insertEmbed(range.index, 'image', reader.result);
        this.quillEditor.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  insertVideo(): void {
    const url = prompt('Insira o URL do vídeo (YouTube, Vimeo, etc.):');
    if (!url) return;

    const embedUrl = this.getVideoEmbedUrl(url);
    if (!embedUrl) {
      this.snackBar.open('URL de vídeo não reconhecido. Use links do YouTube ou Vimeo.', 'Fechar', { duration: 4000 });
      return;
    }

    const range = this.quillEditor.getSelection(true);
    this.quillEditor.insertEmbed(range.index, 'video', embedUrl);
    this.quillEditor.setSelection(range.index + 1);
  }

  private getVideoEmbedUrl(url: string): string | null {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Se já for uma URL de embed, usar diretamente
    if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com/video/')) {
      return url;
    }

    return null;
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      body: [''],
      category_id: [null, Validators.required],
      life_phase_id: [null],
      tag_ids: [[]],
      display_order: [0],
      published: [false]
    });
  }

  private loadSelectData(): void {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
    this.tagService.getAll().subscribe(tags => this.tags = tags);
    this.lifePhaseService.getAll().subscribe(phases => this.lifePhases = phases);
  }

  private loadArticle(id: number): void {
    this.articleService.getById(id).subscribe({
      next: (article) => {
        this.form.patchValue({
          title: article.title,
          body: article.body,
          category_id: article.category_id,
          life_phase_id: article.life_phase_id,
          tag_ids: article.tags?.map(t => t.id) || [],
          display_order: article.display_order,
          published: article.status === 'published'
        });
        if (article.cover_image) {
          this.imagePreview = article.cover_image;
        }
      },
      error: () => {
        this.snackBar.open('Erro ao carregar artigo', 'Fechar', { duration: 3000 });
        this.goBack();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageError = null;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar tipo
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.imageError = `Formato não suportado: "${file.type}". Use JPEG, PNG, WebP ou GIF.`;
        this.selectedFile = null;
        this.selectedFileName = '';
        input.value = '';
        return;
      }

      // Validar tamanho
      if (file.size > this.MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        this.imageError = `Arquivo muito grande (${sizeMB}MB). O tamanho máximo é 2MB.`;
        this.selectedFile = null;
        this.selectedFileName = '';
        input.value = '';
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedImage(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.imagePreview = null;
    this.imageError = null;
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting || this.imageError) {
      return;
    }

    this.isSubmitting = true;
    const formData = this.buildFormData();

    const request$ = this.isEditMode
      ? this.articleService.update(this.articleId!, formData)
      : this.articleService.create(formData);

    request$.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Artigo atualizado com sucesso' : 'Artigo criado com sucesso';
        this.snackBar.open(message, 'Fechar', { duration: 3000 });
        this.goBack();
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 422 && err.error?.errors) {
          const errors = err.error.errors;
          Object.keys(errors).forEach(key => {
            if (key === 'cover_image') {
              this.imageError = errors[key][0];
            } else {
              const control = this.form.get(key);
              if (control) {
                control.setErrors({ serverError: errors[key][0] });
              }
            }
          });
          this.snackBar.open('Corrija os erros no formulário', 'Fechar', { duration: 3000 });
        } else {
          const message = err.error?.message || 'Erro ao salvar artigo';
          this.snackBar.open(message, 'Fechar', { duration: 5000 });
        }
      }
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const values = this.form.value;

    formData.append('title', values.title);
    formData.append('body', values.body || '');
    formData.append('status', values.published ? 'published' : 'draft');
    formData.append('display_order', (values.display_order || 0).toString());

    if (values.category_id) {
      formData.append('category_id', values.category_id.toString());
    }

    if (values.life_phase_id) {
      formData.append('life_phase_id', values.life_phase_id.toString());
    }

    if (values.tag_ids && values.tag_ids.length > 0) {
      values.tag_ids.forEach((tagId: number) => {
        formData.append('tag_ids[]', tagId.toString());
      });
    }

    if (this.selectedFile) {
      formData.append('cover_image', this.selectedFile, this.selectedFile.name);
    }

    return formData;
  }

  goBack(): void {
    this.router.navigate(['/articles']);
  }
}
