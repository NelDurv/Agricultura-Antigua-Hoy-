import React from 'react';

export type BlockType =
  | 'hero'
  | 'stats'
  | 'card-grid'
  | 'feature-grid'
  | 'accordion'
  | 'tabs'
  | 'cta-banner'
  | 'text'
  | 'two-column'
  | 'search-filter';

export interface HeroBlockProps {
  type: 'hero';
  id: string;
  props: {
    badge?: string;
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    gradient?: string;
    searchBar?: boolean;
    searchPlaceholder?: string;
  };
}

export interface StatItem {
  icon: string;
  value: string;
  label: string;
  color?: string;
}

export interface StatsBlockProps {
  type: 'stats';
  id: string;
  props: {
    items: StatItem[];
    columns?: 2 | 3 | 4;
  };
}

export interface CardItem {
  id: string;
  icon?: string;
  image?: string;
  badge?: string;
  title: string;
  description: string;
  tags?: string[];
  link?: string;
  meta?: { label: string; value: string }[];
  footer?: React.ReactNode;
}

export interface CardGridBlockProps {
  type: 'card-grid';
  id: string;
  props: {
    title?: string;
    description?: string;
    items: CardItem[];
    columns?: 2 | 3 | 4;
    cardStyle?: 'default' | 'bordered' | 'minimal';
  };
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  tag?: string;
  link?: string;
}

export interface FeatureGridBlockProps {
  type: 'feature-grid';
  id: string;
  props: {
    title?: string;
    description?: string;
    items: FeatureItem[];
    columns?: 2 | 3 | 4 | 5;
  };
}

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: string;
  defaultOpen?: boolean;
}

export interface AccordionBlockProps {
  type: 'accordion';
  id: string;
  props: {
    title?: string;
    items: AccordionItem[];
  };
}

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
}

export interface TabsBlockProps {
  type: 'tabs';
  id: string;
  props: {
    items: TabItem[];
    defaultTab?: string;
  };
}

export interface CTABannerBlockProps {
  type: 'cta-banner';
  id: string;
  props: {
    title: string;
    description?: string;
    buttonText: string;
    buttonLink: string;
    gradient?: string;
    icon?: string;
    badge?: string;
  };
}

export interface TextBlockProps {
  type: 'text';
  id: string;
  props: {
    title?: string;
    content: string;
    variant?: 'prose' | 'compact';
  };
}

export interface TwoColumnBlockProps {
  type: 'two-column';
  id: string;
  props: {
    left: { title?: string; content: React.ReactNode; width?: 3 | 4 | 5 };
    right: { title?: string; content: React.ReactNode; width?: 7 | 8 | 9 };
  };
}

export interface SearchFilterBlockProps {
  type: 'search-filter';
  id: string;
  props: {
    placeholder?: string;
    filters?: { id: string; label: string }[];
    onSearch?: (query: string) => void;
    onFilter?: (filterId: string) => void;
  };
}

export type PageBlock =
  | HeroBlockProps
  | StatsBlockProps
  | CardGridBlockProps
  | FeatureGridBlockProps
  | AccordionBlockProps
  | TabsBlockProps
  | CTABannerBlockProps
  | TextBlockProps
  | TwoColumnBlockProps
  | SearchFilterBlockProps;

export interface PageConfig {
  id: string;
  blocks: PageBlock[];
}
