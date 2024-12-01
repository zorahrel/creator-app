export type Component = {
  id: string;
  type: string;
  name: string;
  classes: string[];
  styles: React.CSSProperties;
  children: Component[];
  content?: string;
  isTextComponent?: boolean;
};

export type ViewMode = 'desktop' | 'tablet' | 'mobile';
export type Theme = 'light' | 'dark';
export type EditorMode = 'edit' | 'pan';

export type ComponentType = {
  type: string;
  name: string;
  icon: React.ReactNode;
};