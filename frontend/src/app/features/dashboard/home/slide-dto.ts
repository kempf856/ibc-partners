export interface SlideDto {
  id: number;
  description: string;
  slide: string;
  active: boolean;
  visibleFrom: string | null;
  visibleTo: string | null;
  sortOrder: number | null;
}
