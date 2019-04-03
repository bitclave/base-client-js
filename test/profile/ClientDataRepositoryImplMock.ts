import { ClientDataRepository } from '../../src/repository/client/ClientDataRepository';
import FileMeta from '../../src/repository/models/FileMeta';

export default class ClientDataRepositoryImplMock implements ClientDataRepository {

    private _clientData: Map<string, Map<string, string>> = new Map();

    public clearData() {
        this._clientData.clear();
    }

    public setMockData(id: string, data: Map<string, string>) {
        this._clientData.set(id, data);
    }

    public getData(id: string): Promise<Map<string, string>> {
        return new Promise<Map<string, string>>(resolve => resolve(this._clientData.get(id)));
    }

    public updateData(id: string, data: Map<string, string>): Promise<Map<string, string>> {
        return new Promise<Map<string, string>>(resolve => {
            this._clientData.set(id, data);
            resolve(data);
        });
    }

    public getFile(id: string, fileId: number): Promise<FileMeta> {
        return Promise.resolve(new FileMeta());
    }

    public uploadFile(id: string, file: FileMeta, fileId?: number | null): Promise<FileMeta> {
        return Promise.resolve(new FileMeta());
    }
}
