import { ClientDataRepository } from './ClientDataRepository';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import { JsonUtils } from '../../utils/JsonUtils';

export default class ClientDataRepositoryImpl implements ClientDataRepository {

    private readonly CLIENT_GET_DATA: string = '/v1/client/{pk}/';
    private readonly CLIENT_SET_DATA: string = '/v1/client/';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    getData(pk: string): Promise<Map<string, string>> {
        return this.transport
            .sendRequest(
                this.CLIENT_GET_DATA.replace('{pk}', pk),
                HttpMethod.Get
            )
            .then((response) => JsonUtils.jsonToMap<string, string>(response.json));
    }

    updateData(pk: string, data: Map<string, string>): Promise<Map<string, string>> {
        return this.transport
            .sendRequest(
                this.CLIENT_SET_DATA,
                HttpMethod.Patch, JsonUtils.mapToJson(data)
            )
            .then((response) => JsonUtils.jsonToMap<string, string>(response.json));
    }

}