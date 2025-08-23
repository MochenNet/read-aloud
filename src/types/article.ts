export interface Article {
  id: string;
  title: string;
  author?: string;
  text: string;
  imageUrl?: string; // Re-add imageUrl as optional
  audioUrl: string;
  content?: string; // Add content as optional, as it's in the data but not always used directly
}