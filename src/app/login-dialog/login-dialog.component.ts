import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { BlogServiceService } from '../blog-service.service';
import { UserServiceService } from '../user-service.service';
import { User } from '../user'

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  providers: [BlogServiceService]
})
export class LoginDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<LoginDialogComponent>, private _blogService: BlogServiceService, private _userLogin: UserServiceService) { }

  ngOnInit() {
  }


  //Dang nhap voi FB
  getLoginFacebook() {
    this._blogService.Login({ Command: "getCategoryList" }).subscribe(
      data => {
        this._userLogin.setUser(new User(data.ID, data.Name, data.Email, data.Introduce, data.Avatar, data.Level, data.OauthProvider, data.IDFaceBook, data.Status));
        this.dialogRef.close();
        // console.log(this._userLogin.info);
      },
      error => console.log("Error HTTP Post Service"),
      () => console.log("Get login Done !")
    );
  }
}
