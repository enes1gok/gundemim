import { Category } from '../types/app';

export interface CategoryMeta {
  id: Category;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'siyaset', label: 'Siyaset', icon: 'flag', color: '#FF6B6B' },
  { id: 'ekonomi', label: 'Ekonomi', icon: 'trending-up', color: '#4ECDC4' },
  { id: 'spor', label: 'Spor', icon: 'trophy', color: '#45B7D1' },
  { id: 'kultur', label: 'Kültür & Eğlence', icon: 'musical-notes', color: '#F7DC6F' },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  siyaset: 'Siyaset',
  ekonomi: 'Ekonomi',
  spor: 'Spor',
  kultur: 'Kültür & Eğlence',
};
