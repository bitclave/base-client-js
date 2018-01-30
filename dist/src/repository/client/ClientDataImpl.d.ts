import { ClientData } from './ClientData';
import { HttpTransport } from '../source/HttpTransport';
export default class ClientDataImpl implements ClientData {
    private readonly CLIENT_DATA;
    private transport;
    constructor(transport: HttpTransport);
    getData(id: string): Promise<Map<string, string>>;
    updateData(id: string, data: Map<string, string>): Promise<Map<string, string>>;
}
