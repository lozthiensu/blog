import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Thread } from '../thread';
import { Category } from '../category';
import { BlogServiceService } from '../blog-service.service';
import { UserServiceService } from '../user-service.service';
import { User } from '../user'
import { Router, ActivatedRoute } from '@angular/router';


interface ThreadsResponse {
  items: Thread[];
}
@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css'],
  providers: [BlogServiceService]
})
export class HomeViewComponent {

  constructor(private _blogService: BlogServiceService, private _userLogin: UserServiceService, private _router: Router, private _route: ActivatedRoute) {
  }

  listCategorys: Category[] = [];

  threadsByPage: Observable<Thread[]>;
  threadsMostView: Observable<Thread[]>;
  threadsMostViewThumb: Thread[] = [];
  threadsMostComment: Observable<Thread[]>;
  threadsMostCommentThumb: Thread[] = [];
  threadsLastestUpdate: Observable<Thread[]>;
  page: number = 1;
  total: number;
  loading: boolean;

  ngOnInit() {
    this.getThreadsByPage(1);
    this.getThreadsByMostView();
    this.getThreadsByMostComment();
    this.getThreadByLastestUpdate();
    this.getListCategory();
  }

  getListCategory() {
    this._blogService.Category({ Command: "getCategoryList" }).subscribe(
      data => {
        var n = data.items.length;
        for (var i = 0; i < n; i++) {
          this.listCategorys.push(new Category(data.items[i].Index, data.items[i].ID, data.items[i].IDParent, data.items[i].Name, data.items[i].MenuTop, data.items[i].MenuRight, data.items[i].Priority, data.items[i].MenuFooter));
        }
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get thread most view Done !")
    );
  }


  denTrangChu() {
    this._router.navigate(['']);
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });
  }
  xemBaiViet(thread: Thread) {
    this._router.navigate(['/bai-viet/' + this.ChangeToSlug(thread.name) + '/', thread.id]);
  }
  xemDanhMuc(category: Category) {
    this._router.navigate(['/danh-muc/' + this.ChangeToSlug(category.name) + '/', category.id]);
  }
  getLogin() {
    this._blogService.Login({ Command: "getCategoryList" }).subscribe(
      data => {
        this._userLogin.setUser(new User(data.ID, data.Name, data.Email, data.Introduce, data.Avatar, data.Level, data.OauthProvider, data.IDFaceBook, data.Status));
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get thread most view Done !")
    );
  }
  logout() {
    this._userLogin.clearUser();
  }

  getThreadsByMostView() {
    this.loading = true;
    this.threadsMostView = this.serverCallThreadsByMostView({ Command: "getThreadByMostView" })
      .do(res => {
        this.loading = false;
      })
      .map(res => res.items);
  }
  serverCallThreadsByMostView(param: Object): Observable<ThreadsResponse> {
    var temp: Thread[] = [];
    this._blogService.Thread(param).subscribe(
      data => {
        this.threadsMostViewThumb.push(new Thread(data.items[0].Index, data.items[0].ID, data.items[0].Name, data.items[0].Intro, data.items[0].ImageThumb, data.items[0].Time, data.items[0].View, data.items[0].NumberOfComment));
        for (var i = 1; i < data.total; i++) {
          temp.push(new Thread(data.items[i].Index, data.items[i].ID, data.items[i].Name, data.items[i].Intro, data.items[i].ImageThumb, data.items[i].Time, data.items[i].View, data.items[i].NumberOfComment));
        }
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get thread most view Done !")
    );
    return Observable
      .of({
        items: temp
      }).delay(0);
  }

  getThreadsByMostComment() {
    this.loading = true;
    this.threadsMostComment = this.serverCallThreadsByMostComment({ Command: "getThreadByMostComment" })
      .do(res => {
        this.loading = false;
      })
      .map(res => res.items);
  }
  serverCallThreadsByMostComment(param: Object): Observable<ThreadsResponse> {
    var temp: Thread[] = [];
    this._blogService.Thread(param).subscribe(
      data => {
        this.threadsMostCommentThumb.push(new Thread(data.items[0].Index, data.items[0].ID, data.items[0].Name, data.items[0].Intro, data.items[0].ImageThumb, data.items[0].Time, data.items[0].View, data.items[0].NumberOfComment));
        for (var i = 1; i < data.total; i++) {
          temp.push(new Thread(data.items[i].Index, data.items[i].ID, data.items[i].Name, data.items[i].Intro, data.items[i].ImageThumb, data.items[i].Time, data.items[i].View, data.items[i].NumberOfComment));
        }
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get thread most comment Done !")
    );
    return Observable
      .of({
        items: temp
      }).delay(0);
  }

  getThreadByLastestUpdate() {
    this.loading = true;
    this.threadsLastestUpdate = this.serverCallThreadByLastestUpdate({ Command: "getThreadByLastestUpdate" })
      .do(res => {
        this.loading = false;
      })
      .map(res => res.items);
  }
  serverCallThreadByLastestUpdate(param: Object): Observable<ThreadsResponse> {
    var temp: Thread[] = [];
    this._blogService.Thread(param).subscribe(
      data => {
        for (var i = 0; i < data.total; i++) {
          temp.push(new Thread(data.items[i].Index, data.items[i].ID, data.items[i].Name, data.items[i].Intro, data.items[i].ImageThumb, data.items[i].Time, data.items[i].View, data.items[i].NumberOfComment));
        }
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get thread most comment Done !")
    );
    return Observable
      .of({
        items: temp
      }).delay(0);
  }

  getThreadsByPage(page: number) {
    this.loading = true;
    this.threadsByPage = this.serverCallWithoutPage({ Command: "getThreads", Page: page, numOfItem: 7 })
      .do(res => {
        this.page = page;
        this.loading = false;
      })
      .map(res => res.items);
    this._router.events.subscribe(() => {
      window.scrollTo(0, 0);
    });
  }
  serverCallWithoutPage(param: Object): Observable<ThreadsResponse> {
    var temp: Thread[] = [];
    this._blogService.Thread(param).subscribe(
      data => {
        var n = data.items.length;
        for (var i = 0; i < n; i++) {
          temp.push(new Thread(i, data.items[i].ID, data.items[i].Name, data.items[i].Intro, data.items[i].ImageThumb, data.items[i].Time, data.items[i].NumberOfComment));
        }
        this.total = data.total;
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get thread most view Done !")
    );
    // console.log(temp);
    return Observable
      .of({
        items: temp
      }).delay(0);
  }

  ChangeToSlug(param: string) {
    var slug;
    slug = param.toLowerCase();
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    slug = slug.replace(/ /gi, "-");
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    return slug;
  }
}
