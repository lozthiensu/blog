import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { User } from './user'

@Injectable()
export class UserServiceService {

  public info: User;
  constructor() {
    this.info = new User();
    this.info.id = -1;
  }

  setUser(user: User) {
    this.info = user;
  }

  clearUser() {
    this.info = new User();
    this.info.id = -1;
  }

}
