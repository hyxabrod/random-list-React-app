

export class IItemRepository {

    async getItems(page, pageSize) {
        throw new Error('Method not implemented');
    }

    async getItemDetail(id) {
        throw new Error('Method not implemented');
    }

    async refreshItems() {
        throw new Error('Method not implemented');
    }
}
