export interface BlogPost {
  postId: number;
  authorsName: string;
  coverImagePath: string;
  title: string;
  summary: string;
  body: string;
  tags: string;
  category: Category;
  dateCreated: Date;
}

export interface Category {
    categoryName: string;
}