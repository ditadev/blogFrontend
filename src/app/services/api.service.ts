import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError,retry, map } from 'rxjs';
import { AuthorResponse } from '../models/author-response';
import { Article } from '../models/article';


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

    public updateArticle(postId:any, article:any):Observable<any>{
      const url = `${this.articleUrl}/UpdatePost?id=${postId}`;
      return this.http.patch(url,article,this.httpOptions).pipe(retry(1), catchError(this.handleError));
    }

    deleteArticle(postId: any): Observable<any> {
      const url = `${this.articleUrl}/DeletePost/${postId}`;
      return this.http.delete<any>(url).pipe(
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
