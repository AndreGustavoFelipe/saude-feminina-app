export interface Article {
  id: number;
  title: string;
  body: string;
  cover_image: string | null;
  status: 'published' | 'draft';
  category_id: number;
  life_phase_id: number | null;
  display_order: number;
  category?: Category;
  tags?: Tag[];
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}
