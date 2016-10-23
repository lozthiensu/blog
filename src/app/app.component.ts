//Import modul core
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'hammerjs';

//Import cookie
import { Cookie } from 'ng2-cookies/ng2-cookies';

//Import entity class
import { User } from './user'

//Impoer Service
import { BlogServiceService } from './blog-service.service';
import { UserServiceService } from './user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [BlogServiceService]
})

export class AppComponent {

  constructor(private _blogService: BlogServiceService, private _userLogin: UserServiceService) {
  }

  //Khai bao cac bien
  ngOnInit() {
    //Xac dinh loai tu dong dang nhap de dang nhap hop ly
    let myCookie = Cookie.get('userTokent');
    let myCookie2 = Cookie.get('userSocial');
    let myCookie3 = Cookie.get('firstFB');
    if (myCookie3 == "true") {
      Cookie.delete('firstFB');
      let myCookiex = Cookie.get('infoUser');
      var user = JSON.parse(myCookiex);
      this._userLogin.setUser(new User(user.ID, user.Name, user.Email, user.Introduce, user.Avatar, user.Level, user.OauthProvider, user.IDFaceBook, user.Status));
      Cookie.set('userSocial', "true", 2);
      Cookie.delete('infoUser');
    } else if (myCookie2 == "true") {
      this._blogService.LoginFB({ Command: "loginFacebook" }).subscribe(
        data => {
          this._userLogin.setUser(new User(data.ID, data.Name, data.Email, data.Introduce, data.Avatar, data.Level, data.OauthProvider, data.IDFaceBook, data.Status));
          Cookie.set('userSocial', "true", 2);
        },
        error => console.log("Error HTTP Post Service"),
        () => console.log("Get login Done !")
      );
    } else {
      this._blogService.Login({ Command: "loginAuto", Tokent: myCookie }).subscribe(
        data => {
          if (data != null) {
            this._userLogin.setUser(new User(data.ID, data.Name, data.Email, data.Introduce, data.Avatar, data.Level, data.OauthProvider, data.IDFaceBook, data.Status));
          }
        },
        error => console.log("Error HTTP Post Service"),
        () => console.log("Get login Done !")
      );
    }
  }

}
