import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MdDialogRef, MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { BlogServiceService } from '../blog-service.service';
import { UserServiceService } from '../user-service.service';
import { User } from '../user'
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  providers: [BlogServiceService, MdSnackBar]
})
export class LoginDialogComponent implements OnInit {
  user: User = new User();
  showRegister: boolean;
  textRegister: string;
  textButton: string;
  capCha: String;
  constructor(
    public dialogRef: MdDialogRef<LoginDialogComponent>,
    private _blogService: BlogServiceService,
    private _userLogin: UserServiceService,
    private snackBar: MdSnackBar,
    private viewContainerRef: ViewContainerRef,
    // private _component: ReCaptchaComponent
  ) {

  }
  // handleCorrectCaptcha(event) { this.capCha = this._component.getResponse(); console.log(this._component.getResponse()); }


  ngOnInit() {
    this.showRegister = false;
    this.textRegister = this.showRegister == false ? "Nhấn vào đây để đăng ký" : "Nhấn vào đây để đăng nhập";
    this.textButton = this.showRegister == false ? "Đăng nhập" : "Đăng ký";
  }

  changState() {
    this.showRegister = !this.showRegister;
    this.textRegister = this.showRegister == false ? "Nhấn vào đây để đăng ký" : "Nhấn vào đây để đăng nhập";
    this.textButton = this.showRegister == false ? "Đăng nhập" : "Đăng ký";
  }

  //Dang nhap voi FB
  submit() {
    if (this.showRegister == true) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.user.email == '' || !re.test(this.user.email)) {
        let config = new MdSnackBarConfig(this.viewContainerRef);
        this.snackBar.open("Email không hợp lệ", 'Thử lại', config);
      }
      else if (this.user.username == '' || this.user.username.length < 8) {
        let config = new MdSnackBarConfig(this.viewContainerRef);
        this.snackBar.open("Tài khoản phải từ 8 -> 30 kí tự", 'Thử lại', config);
      }
      else if (this.user.pass == '' || this.user.pass.length < 8) {
        let config = new MdSnackBarConfig(this.viewContainerRef);
        this.snackBar.open("Mật khẩu phải từ 8 -> 30 kí tự", 'Thử lại', config);
      }
      else if (this.user.name == '' || this.user.name.length < 8) {
        let config = new MdSnackBarConfig(this.viewContainerRef);
        this.snackBar.open("Tên phải từ 8 -> 50 kí tự", 'Thử lại', config);
      } else {
        this._blogService.Login({ Command: "register", Username: this.user.username, Pass: this.user.pass, Email: this.user.email, Name: this.user.name }).subscribe(
          data => {
            if (data.Error != null) {
              let config = new MdSnackBarConfig(this.viewContainerRef);
              this.snackBar.open(data.Error, 'Thử lại', config);
            } else {
              this._userLogin.setUser(new User(data.ID, data.Name, data.Email, data.Introduce, data.Avatar, data.Level, data.OauthProvider, data.IDFaceBook, data.Status));
              Cookie.set('userTokent', data.Tokent, 2);
              this.dialogRef.close();
            }
          },
          error => console.log("Error HTTP Post Service"),
          () => console.log("Get login Done !")
        );
      }
    }
    else {
      this._blogService.Login({ Command: "login", Username: this.user.username, Pass: this.user.pass }).subscribe(
        data => {
          if (data.Error != null) {
            let config = new MdSnackBarConfig(this.viewContainerRef);
            this.snackBar.open(data.Error, 'Thử lại', config);
          } else {
            this._userLogin.setUser(new User(data.ID, data.Name, data.Email, data.Introduce, data.Avatar, data.Level, data.OauthProvider, data.IDFaceBook, data.Status));
            Cookie.set('userTokent', data.Tokent, 2);
            this.dialogRef.close();
          }
        },
        error => console.log("Error HTTP Post Service"),
        () => console.log("Get login Done !")
      );
    }
  }

  //Dang nhap voi FB
  getLoginFacebook() {
    this._blogService.LoginFB({ Command: "loginFacebook" }).subscribe(
      data => {
        this._userLogin.setUser(new User(data.ID, data.Name, data.Email, data.Introduce, data.Avatar, data.Level, data.OauthProvider, data.IDFaceBook, data.Status));
        Cookie.set('userSocial', "true", 2);
        this.dialogRef.close();
      },
      error => {
        window.location.href = 'http://codew.net/blogAPI/fb_login/index.php?id=first';
        Cookie.set('URL', window.location.pathname, 2);
      },
      () => console.log("Get login Done !")
    );
  }
}
