
export class ItemDetail {
    constructor(id, title, text, metadata) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.metadata = metadata || {
            sentencesCount: 0,
            charactersCount: 0,
            wordsCount: 0,
        };
    }

    static fromData(data) {
        return new ItemDetail(
            data.id,
            data.title,
            data.text,
            data.metadata
        );
    }

    calculateMetadata() {
        const sentences = this.text.split('.').filter(s => s.trim().length > 0).length;
        const words = this.text.split(/\s+/).filter(w => w.length > 0).length;

        this.metadata = {
            sentencesCount: sentences,
            charactersCount: this.text.length,
            wordsCount: words,
        };

        return this;
    }

    isValid() {
        return this.id && this.title && this.text && this.text.length > 0;
    }
}
