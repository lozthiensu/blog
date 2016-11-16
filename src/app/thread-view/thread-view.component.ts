//Import modul core
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Title } from '@angular/platform-browser';

//Import entity class
import { Thread } from '../thread';
import { Category } from '../category';
import { User } from '../user';
import { Comment } from '../comment';
import { Tag } from '../tag';

//Import modul material dialog
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

//Impoer Service
import { BlogServiceService } from '../blog-service.service';
import { UserServiceService } from '../user-service.service';

//Import pipe trust html
import { TrustAllHTMLPipe } from '../trust-all-html.pipe';

//Import cookie
import { Cookie } from 'ng2-cookies/ng2-cookies';

//Interface save thread
interface ThreadsResponse {
  items: Thread[];
}

//Interface save comment
interface CommentsResponse {
  items: Comment[];
}

@Component({
  selector: 'app-thread-view',
  templateUrl: './thread-view.component.html',
  styleUrls: ['./thread-view.component.css'],
  providers: [BlogServiceService, TrustAllHTMLPipe]
})

export class ThreadViewComponent implements OnInit {
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
  threadView: Thread[] = []; //Chua bai viet dang xem
  tags: Tag[] = []; //Tags cua bai viet dang xem
  listCategorys: Category[] = []; //Danh muc
  newComment: Comment = new Comment(); //Comment moi
  threadsByPage: Observable<Thread[]>; //Danh sach bai viet
  threadsMostView: Observable<Thread[]>; //Danh sach bai viet duoc xem nhieu
  threadsMostViewThumb: Thread[] = []; //Bai viet duoc xem nhieu nhat
  threadsMostComment: Observable<Thread[]>; //Danh sach bai viet duoc comment nhieu
  threadsMostCommentThumb: Thread[] = []; //Bai viet duoc comment nhieu nhat
  threadsLastestUpdate: Observable<Thread[]>; //Danh sach bai viet moi duoc update
  threadsSimilar: Observable<Thread[]>; //Danh sach bai viet cung chuyen muc
  commentsByThread: Observable<Comment[]>; //Danh sach comment
  idThread: number = 1; //ID cua bai viet dang xem
  tuKhoaTim: string; //Tu khoa tim kiem
  idVideo: string;  //Id video youtube
  getTitle: string;

  //Khoi tao du lieu khi xem trang web nay
  ngOnInit() {
    this._blogService.Setting().subscribe(
      data => {
        this.getTitle = data.First;
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get title setting done !")
    );
    this._route.params.forEach((params: Params) => {
      this.idThread = +params['id'];
    });
    this.getThreadsById(this.idThread);
    this.getThreadByLastestUpdate();
    this.getListCategory();
    this.getCommentsByThread();
    this.getThreadBySimilar();
    this.newComment.idParent = -1;
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

  //Doan code xem video youtube chua co dinh.

  //Khai bao player va cac bien boolean
  private player;
  private ytEvent;
  videoIsPlaying: boolean = false;
  textvideoIsPlaying: string = "Play";
  videoIsMute: boolean = false;
  textvideoIsMute: string = "Tắt tiếng";

  //Khoi tao player youtube
  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    this.player = player;
  }

  //Tua toi player 7s
  fastBackward() {
    var currentTime = this.player.getCurrentTime();
    this.player.seekTo(currentTime - 7, true);
    this.player.playVideo();
  }
  //Tua lui player 7s
  fastForward() {
    var currentTime = this.player.getCurrentTime();
    this.player.seekTo(currentTime + 7, true);
    this.player.playVideo();
  }

  //Play, pause player
  playPauseVideo() {
    if (this.videoIsPlaying == false) {
      this.videoIsPlaying = true;
      this.player.playVideo();
      this.textvideoIsPlaying = "Pause";
      return 0;
    }
    this.videoIsPlaying = false;
    this.player.pauseVideo();
    this.textvideoIsPlaying = "Play";
  }

  //Mute, unmute player
  muteVideo() {
    if (this.videoIsMute == false) {
      this.videoIsMute = true;
      this.player.mute();
      this.textvideoIsMute = "Bật tiếng";
      return 0;
    }
    this.videoIsMute = false;
    this.textvideoIsMute = "Tắt tiếng";
    this.player.unMute();
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

  //Nhay den tag
  xemTag(tag: Tag) {
    this._router.navigate(['/tag/', this.ChangeToSlug(tag.name)]);
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });
  }

  //Nhay trang xem bai viet voi id
  xemBaiViet(thread: Thread) {
    this.idThread = thread.id;
    this.getThreadsById(this.idThread);
    this.getCommentsByThread();
    this.newComment.idParent = -1;
    this._router.navigate(['/bai-viet/' + this.ChangeToSlug(thread.name) + '/', thread.id]);
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });

  }

  //Dang xuat
  logout() {
    let myCookie = Cookie.get('userTokent');
    this._blogService.Login({ Command: "logout", Tokent: myCookie }).subscribe(
      data => {
        this._userLogin.clearUser();
        Cookie.delete('userTokent');
        Cookie.delete('userSocial');
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get login Done !")
    );
  }

  //Xoa binh luan
  xoaComment() {
    this.newComment = new Comment();
    this.newComment.idParent = -1;
  }

  //Tra loi binh luan
  replyComment(comment: Comment) {
    this.newComment = new Comment();
    this.newComment.idParent = comment.id;
    comment.showRepply = !comment.showRepply;
  }

  //Like binh luan
  likeComment(comment: Comment) {
    this._blogService.Comment({ Command: "likeComment", IdComment: comment.id, UserID: this._userLogin.info.id }).subscribe(
      data => {
        comment.vote = data.total;
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Like comment Done !")
    );
  }

  //Dang binh luan/tra loi
  postComment() {
    if (this.newComment.content == null || this.newComment.content.length < 10)
      alert("Nội dung quá ngắn");
    else {
      this.newComment.idThread = this.idThread;
      this.newComment.idUser = this._userLogin.info.id;
      this._blogService.Comment({ Command: "addComment", IdParent: this.newComment.idParent, IdThread: this.newComment.idThread, IdUser: this.newComment.idUser, Content: this.newComment.content }).subscribe(
        data => {
          this.xoaComment();
          this.getCommentsByThread();
        },
        error => console.log("Error HTTP Post Service"),
        () => console.log("Get post comment Done !")
      );
    }
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
      () => console.log("Get list category Done !")
    );
  }

  //Lay danh sach bai viet lien quan
  getThreadBySimilar() {
    this.threadsSimilar = this.serverCallThreadByLastestUpdate({ Command: "getThreadBySimilar", IdThread: this.idThread })
      .do(res => {
      })
      .map(res => res.items);
  }
  serverCallThreadBySimilar(param: Object): Observable<ThreadsResponse> {
    var temp: Thread[] = [];
    this._blogService.Thread(param).subscribe(
      data => {
        for (var i = 0; i < data.total; i++) {
          temp.push(new Thread(data.items[i].Index, data.items[i].ID, data.items[i].Name, data.items[i].Intro, data.items[i].ImageThumb, data.items[i].Time, data.items[i].View, data.items[i].NumberOfComment));
        }
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get thread last update Done !")
    );
    return Observable
      .of({
        items: temp
      }).delay(0);
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
      () => console.log("Get thread last update Done !")
    );
    return Observable
      .of({
        items: temp
      }).delay(0);
  }

  //Lay bai viet dang xem voi id
  getThreadsById(id: number) {
    this._blogService.Thread({ Command: "getThreadByID", Id: id }).subscribe(
      data => {
        this.threadView = [];
        this.threadView.push(new Thread(0, data.items[0].ID, data.items[0].Name, data.items[0].Intro, data.items[0].ImageThumb, data.items[0].Time, data.items[0].View, data.items[0].NumberOfComment, data.items[0].Content, data.items[0].Tag, data.items[0].Category, data.items[0].CategoryName, data.items[0].Author, data.items[0].AuthorAvatar, data.items[0].Introduce));
        if ( data.items[0].Youtube != "" ) {
          var temp = data.items[0].Youtube.split("=");
          this.idVideo = temp[1];
        }
        else{
            this.idVideo = null;
        }
        var array = JSON.parse(data.items[0].Tag);
        this.tags = [];
        for (var i = 0; i < array.length; i++) {
          this.tags.push(new Tag(i, array[i]));
        }
        this._titleService.setTitle(this.threadView[0].name + ' - ' + this.getTitle);
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get thread by id Done !")
    );
  }

  //Lay danh sach comment cho bai viet dang xem
  getCommentsByThread() {
    this.commentsByThread = this.serverCallCommentsByThread({ Command: "getComments", IdThread: this.idThread })
      .do(res => {
      })
      .map(res => res.items);
  }
  serverCallCommentsByThread(param: Object): Observable<CommentsResponse> {
    var temp: Comment[] = [];
    this._blogService.Comment(param).subscribe(
      data => {
        for (var i = 0; i < data.total; i++) {
          temp.push(new Comment(data.items[i].ID, data.items[i].IDParent, data.items[i].IDThread, data.items[i].UserName, data.items[i].IDUser, data.items[i].Content, data.items[i].Time, data.items[i].Vote, data.items[i].AvatarUser));
        }
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get comment by id Done !")
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
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|\[|\]|\{|\}|_/gi, '');
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