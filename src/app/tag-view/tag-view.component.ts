import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Thread } from '../thread';
import { Category } from '../category';
import { BlogServiceService } from '../blog-service.service';
import { UserServiceService } from '../user-service.service';
import { User } from '../user'
import { Router, ActivatedRoute, Params} from '@angular/router';


interface ThreadsResponse {
  items: Thread[];
}
@Component({
  selector: 'app-tag-view',
  templateUrl: './tag-view.component.html',
  styleUrls: ['./tag-view.component.css'],
  providers: [BlogServiceService]
})
export class TagViewComponent {

  constructor(private _blogService: BlogServiceService, private _userLogin: UserServiceService, private _router: Router, private _route: ActivatedRoute) {
  }

  listCategorys: Category[] = [];
  tagKey: string;
  threadsByPage: Observable<Thread[]>;
  threadsMostView: Observable<Thread[]>;
  threadsMostViewThumb: Thread[] = [];
  threadsMostComment: Observable<Thread[]>;
  threadsMostCommentThumb: Thread[] = [];
  threadsLastestUpdate: Observable<Thread[]>;
  tenDanhMuc: string;
  page: number = 1;
  total: number;
  loading: boolean;

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.tagKey = params['string'];
      this.tagKey = this.tagKey.replace(/-/gi, " ");
    });
    this.getThreadsByPage(1);
    this.getThreadByLastestUpdate();
    this.getListCategory();
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });
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
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });
  }
  xemDanhMuc(category: Category) {
    this._router.navigate(['/danh-muc/' + this.ChangeToSlug(category.name) + '/', category.id]);
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });
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
    this.threadsByPage = this.serverCallWithoutPage({ Command: "getThreadByTag", Page: page, Tag: this.tagKey, numOfItem: 7 })
      .do(res => {
        this.page = page;
        this.loading = false;
      })
      .map(res => res.items);
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
        this.tenDanhMuc = data.tenDanhMuc;
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

