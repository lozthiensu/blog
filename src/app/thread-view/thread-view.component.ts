import { ChangeDetectionStrategy, Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Thread } from '../thread';
import { Category } from '../category';
import { BlogServiceService } from '../blog-service.service';
import { UserServiceService } from '../user-service.service';
import { User } from '../user'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TrustAllHTMLPipe } from '../trust-all-html.pipe';
import { HighlightJsService } from 'angular2-highlight-js';
import { Tag } from '../tag';
import { Comment } from '../comment';

interface ThreadsResponse {
  items: Thread[];
}
interface CommentsResponse {
  items: Comment[];
}
@Component({
  selector: 'app-thread-view',
  templateUrl: './thread-view.component.html',
  styleUrls: ['./thread-view.component.css'],
  providers: [BlogServiceService, TrustAllHTMLPipe]
})
export class ThreadViewComponent implements OnInit, AfterViewInit {

  constructor(private _blogService: BlogServiceService, private _userLogin: UserServiceService, private _router: Router, private _route: ActivatedRoute, private el: ElementRef, private service: HighlightJsService) {

  }

  ngAfterViewInit() {
  }

  abc: string;
  threadView: Thread[] = [];
  tags: Tag[] = [];
  listCategorys: Category[] = [];
  newComment: Comment = new Comment();
  threadsByPage: Observable<Thread[]>;
  commentsByThread: Observable<Comment[]>;
  threadsMostView: Observable<Thread[]>;
  threadsMostViewThumb: Thread[] = [];
  threadsMostComment: Observable<Thread[]>;
  threadsMostCommentThumb: Thread[] = [];
  threadsLastestUpdate: Observable<Thread[]>;
  idThread: number = 1;
  total: number;
  loading: boolean;

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.idThread = +params['id'];
    });
    this.getThreadsById(this.idThread);
    this.getThreadByLastestUpdate();
    this.getListCategory();
    this.getCommentsByThread();
    this.getLogin();
    this.newComment.idParent = -1;
    this._router.events.subscribe(() => {
      window.scrollTo(0, 340);
    });
  }

  id = 'OEpsaATevxw';
  private player;
  private ytEvent;
  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    this.player = player;
  }

  fastBackward() {
    var currentTime = this.player.getCurrentTime();
    this.player.seekTo(currentTime - 7, true);
    this.player.playVideo();
  }
  videoIsPlaying: boolean = false;
  textvideoIsPlaying: string = "Play";
  videoIsMute: boolean = false;
  textvideoIsMute: string = "Tắt tiếng";
  fastForward() {
    var currentTime = this.player.getCurrentTime();
    this.player.seekTo(currentTime + 7, true);
    this.player.playVideo();
  }
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

  //Dang nhap voi FB
  getLogin() {
    this._blogService.Login({ Command: "getCategoryList" }).subscribe(
      data => {
        this._userLogin.setUser(new User(data.ID, data.Name, data.Email, data.Introduce, data.Avatar, data.Level, data.OauthProvider, data.IDFaceBook, data.Status));
        // console.log(this._userLogin.info);
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get login Done !")
    );
  }

  //Dang xuat
  logout() {
    this._userLogin.clearUser();
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

  //Lay danh sach bai miet moi cap nhap
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
        this.threadView.push(new Thread(0, data.items[0].ID, data.items[0].Name, data.items[0].Intro, data.items[0].ImageThumb, data.items[0].Time, data.items[0].View, data.items[0].NumberOfComment, data.items[0].Content, data.items[0].Tag, data.items[0].Category, data.items[0].CategoryName, data.items[0].Author, data.items[0].AuthorAvatar));
        var array = JSON.parse(data.items[0].Tag);
        this.tags = [];
        for (var i = 0; i < array.length; i++) {
          this.tags.push(new Tag(i, array[i]));
        }
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get thread by id Done !")
    );
  }

  //Lay danh sach comment cho bai viet dang xem
  getCommentsByThread() {
    this.loading = true;
    this.commentsByThread = this.serverCallCommentsByThread({ Command: "getComments", IdThread: this.idThread })
      .do(res => {
        this.loading = false;
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

