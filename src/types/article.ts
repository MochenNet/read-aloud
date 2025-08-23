export interface Article {
  id: string;
  title: string;
  author?: string;
  text: string;
  imageUrl?: string; // Optional image URL from network
  audioUrl: string;
  content?: string;
}
