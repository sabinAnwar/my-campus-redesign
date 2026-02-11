import React from "react";

export interface NewsItem {
  id?: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: string;
  featured?: boolean;
  publishedAt: string;
  coverImageUrl?: string;
  tags?: string;
}

export interface NewsResponse {
  items: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface NewsModalProps {
  article: NewsItem | null;
  loading: boolean;
  error: string;
  atStart: boolean;
  atEnd: boolean;
  copied: boolean;
  copyLink: () => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  closeBtnRef: React.RefObject<HTMLButtonElement | null>;
}
