export interface Article {
  id: string;
  title: string;
  author?: string; // Make author optional as it was missing in the dummy data
  text: string;
  imageUrl: string;
  audioUrl: string;
}