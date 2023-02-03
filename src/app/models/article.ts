export class Article {
   public pageInfo?: {
      totalCount: number,
      totalPages: number,
      currentPage: number,
      pageSize: number,
      hasNext: boolean,
      hasPrevious: boolean
    };
    public code!: number;
    public message!: string;
    public data!: [{
      authorsName: string,
      coverImagePath: string,
      title: string,
      summary: string,
      body: string,
      tags: string,
      category: {
        categoryName: string
      },
      dateCreated: string
    }];
  }