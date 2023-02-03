export class BlogPost {
public authorsName!: string;
public coverImagePath!: string;
public title!: string;
public summary!: string;
public body!: string;
public tags!: string;
category!: {
  categoryName: string
};
dateCreated!: Date;
}