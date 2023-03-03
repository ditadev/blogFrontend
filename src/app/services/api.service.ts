import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError,retry, map } from 'rxjs';
import { AuthorResponse } from '../models/author-response';
import { Article } from '../models/article';
import { BlogPost } from '../models/blogPost';
import { NewBlogPost } from '../models/newBlogPost';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private authorUrl = `http://localhost:5259/api/Author`;
  private articleUrl = `http://localhost:5259/api/Blog`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
 
  
  constructor(private http:HttpClient) { }

  public registerAuthor(author: any): Observable<any> {
    return this.http.post(`${this.authorUrl}/Register`, author, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  public verifyAuthor(email: string, token:string): Observable<any> {
    return this.http.patch(`${this.authorUrl}/VerifyUser?emailAddress=${email}&token=${token}`, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

   public login(author: any): Observable<any> {
    return this.http.post(`${this.authorUrl}/Login`, author, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  public forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.authorUrl}/ForgotPassword?emailAddress=${email}`, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  public resetPassword(author: any):Observable<any>{
    return this.http.patch(`${this.authorUrl}/ResetPassword`, author, this.httpOptions).pipe(retry(1), catchError(this.handleError));
  }

  public getUser(id: any):Observable<any>{
    const url = `${this.authorUrl}/GetAuthorById?id=${id}`;
    return this.http.get<AuthorResponse>(url).pipe(retry(1), catchError(this.handleError));
  }

  public getArticles(): Observable<any> {
    const url = `${this.articleUrl}/GetAllPosts`;
    return this.http.get<Article>(url).pipe(retry(1), catchError(this.handleError));
    }

    public getRecentArticles(): Observable<any> {
      const url = `${this.articleUrl}/GetRecentPost`;
      return this.http.get<Article>(url).pipe(retry(1), catchError(this.handleError));
      }

      public getArticlesByAuthor(id:any): Observable<any> {
        const url = `${this.articleUrl}/GetPostByAuthor/${id}`;
        return this.http.get<Article>(url).pipe(retry(1), catchError(this.handleError));
        }

    public getArticle(postId:any):Observable<any>{
      const url = `${this.articleUrl}/GetPostById/${postId}`;
      return this.http.get<Article>(url).pipe(retry(1), catchError(this.handleError));
    }


    deleteArticle(postId: any): Observable<any> {
      const url = `${this.articleUrl}/DeletePost/${postId}`;
      return this.http.delete<any>(url).pipe(
        retry(1),
        catchError(this.handleError)
      );
    }


    public updateArticle(file:File, postId: any, article: BlogPost): Observable<any> {
      const url = `${this.articleUrl}/UpdatePost?id=${postId}`;
     
      const formData = new FormData();
      formData.append('CoverImage',file)
      formData.append('Title',article.title)
      formData.append('Summary',article.summary)
      formData.append('Body',article.body)
      formData.append('Tags',article.tags)
      formData.append('CategoryName',article.category.categoryName)
      
      return this.http.put(url, formData).pipe(
        retry(1),
        catchError(this.handleError)
      );
    }
    
    postArticle(file:File, article:NewBlogPost):Observable<any>{
      const url =`${this.articleUrl}/AddPost`;
     
      const formData = new FormData();
      formData.append('CoverImage',file)
      formData.append('Title',article.title)
      formData.append('Summary',article.summary)
      formData.append('Body',article.body)
      formData.append('Tags',article.tags)
      formData.append('CategoryName',article.categoryName)
    
      return this.http.post(url,formData).pipe(
        retry(1),
        catchError(this.handleError)
      );
    }


  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      console.log(errorMessage);
      return errorMessage;
    });
  }
}
