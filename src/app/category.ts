export class Category {
    index: number;
    id: number;
    idParent: number;
    name: string;
    menuTop: number;
    menuRight: number;
    priority: number;
    menuFooter: number;
    constructor(index?: number, id?: number, idParent?: number, name?: string, menuTop?: number, menuRight?: number, priority?: number, menuFooter?: number){
        this.index = index;
        this.id = id;
        this.idParent = idParent;
        this.name = name;
        this.menuTop = menuTop;
        this.menuRight = menuRight;
        this.priority = priority;
        this.menuFooter = menuFooter;
    }
}
