export class Thread {
    index: number;
    id: number;
    name: string;
    intro: string;
    imageThumb: string;
    time: string;
    view: number;
    numberOfComment: number;
    content: string;
    tag: string;
    category: number;
    categoryName: string;
    author: string;
    authorAvatar: string;
    constructor(index?: number, id?: number, name?: string, intro?: string, imageThumb?: string, time?: string, view?: number, numberOfComment?: number, content?: string, tag?: string, category?: number, categoryName?: string, author?: string, authorAvatar?: string){
        this.index = index;
        this.id = id;
        this.name = name;
        this.intro = intro;
        this.content = content;
        this.tag = tag;
        this.category = category;
        this.categoryName = categoryName;
        this.time = time;
        this.view = view;
        this.author = author;
        this.authorAvatar = authorAvatar;
        this.imageThumb = imageThumb;
        this.numberOfComment = numberOfComment;
    }
}
