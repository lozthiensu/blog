export class User {
    id: number;
    name: string;
    email: string;
    introduce: string;
    avatar: string;
    level: number;
    oauthProvider: string;
    idOauth: string;
    status: number;
    constructor(id?: number, name?: string, email?: string, introduce?: string, avatar?: string, level?: number, oauthProvider?: string, idOauth?: string, status?: number){
        this.id = id;
        this.name = name;
        this.email = email;
        this.introduce = introduce;
        this.avatar = avatar;
        this.level = level;
        this.oauthProvider = oauthProvider;
        this.idOauth = idOauth;
        this.status = status;
    }
}
