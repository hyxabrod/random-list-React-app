
export class ListItem {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }

    static fromData(data) {
        return new ListItem(data.id, data.title);
    }

    isValid() {
        return this.id && this.title && this.title.trim().length > 0;
    }
}
