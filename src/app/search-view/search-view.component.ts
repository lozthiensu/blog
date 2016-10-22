//Import modul core
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Title } from '@angular/platform-browser';

//Import entity class
import { Thread } from '../thread';
import { Category } from '../category';
import { User } from '../user';

//Import modul material dialog
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

//Impoer Service
import { BlogServiceService } from '../blog-service.service';
import { UserServiceService } from '../user-service.service';

//Interface save thread
interface ThreadsResponse {
  items: Thread[];
}

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css'],
  providers: [BlogServiceService]
})

export class SearchViewComponent implements OnInit {

  constructor(
    private _blogService: BlogServiceService,
    private _userLogin: UserServiceService,
    private _router: Router,
    private _route: ActivatedRoute,
    public _viewContainerRef: ViewContainerRef,
    public _dialog: MdDialog,
    private _titleService: Title
  ) {
  }

  //Khai bao cac bien
  _dialogRef: MdDialogRef<LoginDialogComponent>;  //Dialog login
  listCategorys: Category[] = []; //Danh muc
  threadsByPage: Observable<Thread[]>; //Danh sach bai viet
  threadsMostView: Observable<Thread[]>; //Danh sach bai viet duoc xem nhieu
  threadsMostViewThumb: Thread[] = []; //Bai viet duoc xem nhieu nhat
  threadsMostComment: Observable<Thread[]>; //Danh sach bai viet duoc comment nhieu
  threadsMostCommentThumb: Thread[] = []; //Bai viet duoc comment nhieu nhat
  threadsLastestUpdate: Observable<Thread[]>; //Danh sach bai viet moi duoc update
  tenDanhMuc: string; //Ten cua danh muc dang xem
  page: number = 1; //So trang cua danh sach bai viet
  total: number;  //Tong so bai viet cua danh sach bai viet
  tuKhoaTim: string; //Tu khoa tim kiem

  //Khoi tao du lieu khi xem trang web nay
  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.tuKhoaTim = params['string'];
      this.tuKhoaTim = this.tuKhoaTim.replace(/-/gi, " ");
    });
    this.getThreadsByPage(1);
    this.getThreadByLastestUpdate();
    this.getListCategory();
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });
  }

  //Show dialog dang nhap
  openLogin() {
    let config = new MdDialogConfig();
    config.viewContainerRef = this._viewContainerRef;
    this._dialogRef = this._dialog.open(LoginDialogComponent, config);
    this._dialogRef.afterClosed().subscribe(result => {
      this._dialogRef = null;
    });
  }

  //Nhay den trang chu
  denTrangChu() {
    this._router.navigate(['']);
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });
  }

  //Nhay den tim kiem
  xemTimKiem() {
    if (this.tuKhoaTim == null || this.tuKhoaTim == "")
      return 0;
    this.tuKhoaTim = this.tuKhoaTim.replace(/ /gi, "-");
    this._router.navigate(['/tim-kiem/' + this.tuKhoaTim]);
    this.getThreadsByPage(1);
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });
  }

  //Nhay den xem bai viet
  xemBaiViet(thread: Thread) {
    this._router.navigate(['/bai-viet/' + this.ChangeToSlug(thread.name) + '/', thread.id]);
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });
  }

  //Nhay den danh muc
  xemDanhMuc(category: Category) {
    this._router.navigate(['/danh-muc/' + this.ChangeToSlug(category.name) + '/', category.id]);
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });
  }

  //Lay danh sach the loai
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

  //Dang xuat
  logout() {
    this._userLogin.clearUser();
  }

  //Lay danh sach bai miet moi cap nhap
  getThreadByLastestUpdate() {
    this.threadsLastestUpdate = this.serverCallThreadByLastestUpdate({ Command: "getThreadByLastestUpdate" })
      .do(res => {
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

  //Danh sach tat ca bai viet theo trang
  getThreadsByPage(page: number) {
    this.threadsByPage = this.serverCallWithoutPage({ Command: "getThreadByKey", Page: page, Key: this.tuKhoaTim, numOfItem: 7 })
      .do(res => {
        this.page = page;
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
    return Observable
      .of({
        items: temp
      }).delay(0);
  }

  //Chuyen thanh url khong dau
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

