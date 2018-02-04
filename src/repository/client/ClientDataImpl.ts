import { ClientData } from './ClientData';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import JsonUtils from '../../utils/JsonUtils';

export default class ClientDataImpl implements ClientData {

    private readonly CLIENT_DATA: string = '/client/{id}/';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    getData(id: string): Promise<Map<string, string>> {
        return this.transport
            .sendRequest(this.CLIENT_DATA.replace('{id}', id), HttpMethod.Get)
            .then((response) => JsonUtils.jsonToMap<string, string>(response.json));
    }

    updateData(id: string, data: Map<string, string>): Promise<Map<string, string>> {
        return this.transport
            .sendRequest(this.CLIENT_DATA.replace('{id}', id), HttpMethod.Patch, data)
            .then((response) => JsonUtils.jsonToMap<string, string>(response.json));
    }

}