export class BlogPost {
public postId!: number;
public authorsName!: string;
public coverImagePath!: string;
public title!: string;
public summary!: string;
public body!: string;
public tags!: string;
public category!: {
  categoryName: string
};
public dateCreated!: Date;
}