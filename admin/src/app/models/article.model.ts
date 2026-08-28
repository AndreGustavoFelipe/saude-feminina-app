import { Category } from './category.model';
import { Tag } from './tag.model';
import { LifePhase } from './life-phase.model';

export interface Article {
  id: number;
  title: string;
  body: string;
  cover_image: string | null;
  status: 'published' | 'draft';
  category_id: number;
  life_phase_id: number | null;
  display_order: number;
  user_id: number;
  category?: Category;
  life_phase?: LifePhase;
  tags?: Tag[];
  created_at?: string;
  updated_at?: string;
}

export interface ArticleFilters {
  category_id?: number;
  tag_id?: number;
  life_phase_id?: number;
  status?: 'published' | 'draft';
}
