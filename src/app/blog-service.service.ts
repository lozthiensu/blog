import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class BlogServiceService {
  constructor(private _http: Http) { }
  private commentsUrl = 'http://localhost/blogAPI/';

  Thread(body: Object) {
    let bodyString = JSON.stringify(body);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(this.commentsUrl + 'home_thread.php', body, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  Category(body: Object) {
    let bodyString = JSON.stringify(body);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(this.commentsUrl + 'category.php', body, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  Comment(body: Object) {
    let bodyString = JSON.stringify(body);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(this.commentsUrl + 'comment.php', body, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  Login(body: Object) {
    let bodyString = JSON.stringify(body);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(this.commentsUrl + 'fakejson.php', body, options)
      .map(res => res.json())
      .catch(this.handleError);
  }
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || ' error');
  }
}