import { ClientDataRepository } from '../../src/repository/client/ClientDataRepository';

export default class ClientDataRepositoryImplMock implements ClientDataRepository {

    private _clientData: Map<string, Map<string, string>> = new Map();

    clearData() {
        this._clientData.clear();
    }

    setMockData(id: string, data: Map<string, string>) {
        this._clientData.set(id, data);
    }

    getData(id: string): Promise<Map<string, string>> {
        return new Promise<Map<string, string>>(resolve => resolve(this._clientData.get(id)));
    }

    updateData(id: string, data: Map<string, string>): Promise<Map<string, string>> {
        return new Promise<Map<string, string>>(resolve => {
            this._clientData.set(id, data);
            resolve(data);
        });
    }

}
