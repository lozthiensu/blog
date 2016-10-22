export class Comment {
    id: number;
    idParent: number;
    idThread: number;
    username: string;
    idUser: number;
    content: string;
    time: string;
    vote: number;
    avatarUser: string;
    showRepply: boolean;
    constructor(id?: number, idParent?: number, idThread?: number, username?: string, idUser?: number, content?: string, time?: string, vote?: number, avatarUser?: string){
        this.id = id;
        this.idParent = idParent;
        this.idThread = idThread;
        this.username = username;
        this.idUser = idUser;
        this.content = content;
        this.time = time;
        this.vote = vote;
        this.avatarUser = avatarUser;
        this.showRepply = false;
    }
}
