import { ClientDataRepository } from './ClientDataRepository';
import { HttpTransport } from '../source/http/HttpTransport';
export default class ClientDataRepositoryImpl implements ClientDataRepository {
    private readonly CLIENT_GET_DATA;
    private readonly CLIENT_SET_DATA;
    private transport;
    constructor(transport: HttpTransport);
    getData(pk: string): Promise<Map<string, string>>;
    updateData(pk: string, data: Map<string, string>): Promise<Map<string, string>>;
}
