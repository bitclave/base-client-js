import { ClientDataRepository } from '../../src/repository/client/ClientDataRepository';
import { FileMeta } from '../../src/repository/models/FileMeta';

export default class ClientDataRepositoryImplMock implements ClientDataRepository {

    private _clientData: Map<string, Map<string, string>> = new Map();

    public clearData() {
        this._clientData.clear();
    }

    public setMockData(id: string, data: Map<string, string>) {
        this._clientData.set(id, data);
    }

    public async getData(id: string, fieldKey?: string | Array<string> | undefined): Promise<Map<string, string>> {
        const map = this._clientData.get(id) || new Map();
        let fields: Array<string> = [];
        const fieldsSet = new Set<string>();

        if (fieldKey && typeof fieldKey === 'string') {
            fields.push(fieldKey);

        } else if (fieldKey && typeof fieldKey === 'object' && fieldKey instanceof Array) {
            fields = fieldKey;
        }

        fields.forEach(key => fieldsSet.add(key));

        const filtered = new Map();
        map.forEach((value, key) => {
            if (fieldsSet.size === 0 || fieldsSet.has(key)) {
                filtered.set(key, value);
            }
        });

        return filtered;
    }

    public updateData(id: string, data: Map<string, string>): Promise<Map<string, string>> {
        this._clientData.set(id, data);
        return Promise.resolve(data);
    }

    public getFile(id: string, fileId: number): Promise<string> {
        throw new Error('method not supported');
    }

    public uploadFile(id: string, file: FileMeta, fileId?: number | null): Promise<FileMeta> {
        throw new Error('method not supported');
    }
}
