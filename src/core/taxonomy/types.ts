export interface TaxonNode {
  id: string;
  label: string;
  description?: string;
  children?: TaxonNode[];
  icon?: string;
}

export interface Taxonomy {
  id: string;
  name: string;
  root: TaxonNode[];
}
