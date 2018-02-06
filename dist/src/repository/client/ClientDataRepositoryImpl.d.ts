import { ClientDataRepository } from './ClientDataRepository';
import { HttpTransport } from '../source/http/HttpTransport';
export default class ClientDataRepositoryImpl implements ClientDataRepository {
    private readonly CLIENT_DATA;
    private transport;
    constructor(transport: HttpTransport);
    getData(id: string): Promise<Map<string, string>>;
    updateData(id: string, data: Map<string, string>): Promise<Map<string, string>>;
}
