import { DataRequest } from '../../src/repository/models/DataRequest';
import OfferShareData from '../../src/repository/models/OfferShareData';
import { DataRequestRepository } from '../../src/repository/requests/DataRequestRepository';

class DataRequestTree extends DataRequest {
    public next: Array<DataRequestTree>;

    constructor(
        fromPk: string,
        toPk: string,
        rootPk: string,
        requestData: string,
        responseData: string,
        next: Array<DataRequestTree>
    ) {
        super(fromPk, toPk, rootPk, requestData, responseData);
        this.next = next;
    }
}

export default class DataRequestRepositoryImplMock implements DataRequestRepository {

    public shareData: Set<OfferShareData> = new Set();
    private data: Array<DataRequest> = [];
    private clientId: string = '0x';

    public clearData() {
        this.data = [];
        this.shareData = new Set();
    }

    public setPK(fromPK: string) {
        this.clientId = fromPK;
    }

    public async requestPermissions(toPk: string, dataRequests: Array<DataRequest>): Promise<void> {
        const existed: Array<DataRequest> = await this.findRequest(this.clientId, toPk, false);
        const result: Array<DataRequest> = dataRequests
            .filter(item => !existed.find(existedItem => existedItem.requestData === item.requestData))
            .map(item => item.copy({fromPk: this.clientId, toPk: `${toPk}`, rootPk: toPk, responseData: ''}));

        this.saveAll(result);
    }

    public async grantAccessForClient(dataRequests: Array<DataRequest>): Promise<void> {
        const fromPk = dataRequests[0].fromPk.toLowerCase();
        const toPk = dataRequests[0].toPk.toLowerCase();
        const existed = await this.findRequest(fromPk, toPk, false);

        const result = dataRequests.map(item => {
                if (item.rootPk !== item.toPk) {
                    const isAccepted = this.acceptedDataForPk(item.rootPk, item.toPk, item.rootPk, item.requestData);
                    if (!isAccepted) {
                        throw Error('data not available for share');
                    }
                }

                const foundItem = existed.find(it => item.requestData === it.requestData);

                if (foundItem) {
                    return foundItem.copy({responseData: item.responseData});

                } else {
                    return item.copy({
                        fromPk: `${fromPk}`,
                        toPk: `${toPk}`,
                        rootPk: item.rootPk,
                        requestData: item.requestData,
                        responseData: item.responseData
                    });
                }
            }
        );

        this.saveAll(result);
    }

    public async revokeAccessForClient(
        clientPk: string,
        publicKey: string,
        dataRequests: Array<DataRequest>
    ): Promise<void> {
        let idsForDelete: Array<number> = [];

        dataRequests.forEach(request => {
            const tree = this.findDependencies(request.toPk, request.rootPk, request.requestData);
            const list = this.treeToListOfRequests(tree);

            idsForDelete = idsForDelete.concat(list.map(itemResult => itemResult.id));
        });

        this.deleteByIds(idsForDelete);
    }

    public async getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>> {
        return this.findRequest(fromPk, toPk);
    }

    public async grantAccessForOffer(
        offerId: number,
        clientPk: string,
        encryptedClientResponse: string,
        priceId: number
    ): Promise<void> {
        this.shareData.add(new OfferShareData(offerId, encryptedClientResponse, priceId));
    }

    private async findRequest(
        fromPk: string | null,
        toPk: string | null,
        makeUnique: boolean = true
    ): Promise<Array<DataRequest>> {

        const result: Array<DataRequest> = [];

        this.data.forEach((item) => {
            if (!fromPk && item.toPk === toPk ||
                !toPk && item.fromPk === fromPk ||
                item.toPk === toPk && item.fromPk === fromPk) {
                if (makeUnique) {
                    result.push(Object.assign(new DataRequest(), item));
                } else {
                    result.push(item);
                }
            }
        });
        return result;
    }

    private deleteByIds(ids: Array<number>) {
        this.data = this.data.filter(item => ids.indexOf(item.id) <= -1);
    }

    private saveAll(items: Array<DataRequest>) {
        const itemsMap: Map<number, DataRequest> = new Map();
        const existedMap: Map<number, DataRequest> = new Map();

        items.forEach((item, index) => itemsMap.set(item.id === 0 ? -index : item.id, item));
        this.data.forEach(item => existedMap.set(item.id, item));

        for (const [key, value] of itemsMap) {
            const existed = existedMap.get(key);
            if (existed) {
                existed.fromPk = value.fromPk;
                existed.toPk = value.toPk;
                existed.rootPk = value.rootPk;
                existed.requestData = value.requestData;
                existed.responseData = value.responseData;

            } else {
                this.data.push(value.copy({id: this.data.length + 1}));
            }
        }
    }

    private acceptedDataForPk(
        to: string,
        from: string,
        root: string,
        requestData: string
    ): boolean {
        const tree = this.findDependencies(to, root, requestData);

        return this.searchInTreeOfRequests(root, from, tree);
    }

    private searchInTreeOfRequests(root: string, from: string, tree: Array<DataRequestTree>): boolean {
        for (const it of tree) {
            if (it.fromPk === from && (it.toPk === root || it.rootPk === root)) {
                return true;
            } else {
                if (this.searchInTreeOfRequests(root, from, it.next)) {
                    return true;
                }
            }
        }
        return false;
    }

    private treeToListOfRequests(tree: Array<DataRequestTree>): Array<DataRequestTree> {
        let result: Array<DataRequestTree> = ([] as Array<DataRequestTree>).concat(tree);

        tree.forEach(it => result = result.concat(this.treeToListOfRequests(it.next)));

        return result;
    }

    private findDependencies(
        to: string,
        root: string,
        requestData: string
    ): Array<DataRequestTree> {
        const allItems = this.data.filter(item => item.requestData === requestData && item.rootPk === root);

        return this.makeTreeOfRequests(allItems, requestData, to, root);
    }

    private makeTreeOfRequests(
        items: Array<DataRequest>,
        requestData: string,
        to: string,
        root: string
    ): Array<DataRequestTree> {
        const filtered = items.filter(it => it.toPk === to && it.rootPk === root && it.requestData === requestData);

        const result: Array<DataRequestTree> = [];

        if (filtered.length > 0) {
            const filteredToIds = filtered.map(item => item.id);
            const nextItems = items.filter(item => filteredToIds.indexOf(item.id) <= -1);

            filtered.forEach(it => {
                const rtResult = this.makeTreeOfRequests(nextItems, requestData, it.fromPk, root);
                const rt = new DataRequestTree(it.fromPk, it.toPk, it.rootPk, '', '', rtResult);
                rt.id = it.id;
                result.push(rt);
            });
        }

        return result;
    }

}
