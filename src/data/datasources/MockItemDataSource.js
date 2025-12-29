import { generateRandomTitle, generateRandomText, generateId } from '../../../utils/randomGenerator';

export class MockItemDataSource {
    constructor() {
        this.cache = new Map();
        this.detailCache = new Map();
    }

    async fetchItems(page, pageSize) {

        await this._delay(300 + Math.random() * 200);

        const items = [];
        for (let i = 0; i < pageSize; i++) {
            const id = generateId();
            const item = {
                id,
                title: generateRandomTitle(),
            };
            items.push(item);
            this.cache.set(id, item);
        }

        return items;
    }

    async fetchItemDetail(id) {

        if (this.detailCache.has(id)) {
            await this._delay(50); 
            return this.detailCache.get(id);
        }

        await this._delay(400 + Math.random() * 300);

        const baseItem = this.cache.get(id) || {
            id,
            title: generateRandomTitle(),
        };

        const detail = {
            id: baseItem.id,
            title: baseItem.title,
            text: generateRandomText(10),
            metadata: null, 
        };

        this.detailCache.set(id, detail);

        return detail;
    }

    async clearCache() {
        await this._delay(100);
        this.cache.clear();
        this.detailCache.clear();
    }

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
