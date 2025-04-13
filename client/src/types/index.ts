export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  summary?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}
