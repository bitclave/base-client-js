import { JsonUtils } from '../../utils/JsonUtils';
import { FileMeta } from '../models/FileMeta';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import { ClientDataRepository } from './ClientDataRepository';

export default class ClientDataRepositoryImpl implements ClientDataRepository {

    private readonly CLIENT_GET_DATA: string = '/v1/client/{pk}';
    private readonly CLIENT_SET_DATA: string = '/v1/client/';
    private readonly FILE_GET_FILE: string = '/v1/file/{pk}/{fileId}/';
    private readonly FILE_UPLOAD_FILE: string = '/v1/file/{pk}/';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    public getData(pk: string, fieldKey?: string | Array<string>): Promise<Map<string, string>> {
        let fields: Array<string> = [];

        if (fieldKey && typeof fieldKey === 'string') {
            fields.push(fieldKey);

        } else if (fieldKey && typeof fieldKey === 'object' && fieldKey instanceof Array) {
            fields = fieldKey;
        }

        fields = fields.map(key => `key=${key}`);
        const queryParams = fields.length > 0 ? `?${fields.join('&')}` : '';

        return this.transport
            .sendRequest(
                this.CLIENT_GET_DATA.replace('{pk}', pk).concat(queryParams),
                HttpMethod.Get
            )
            .then((response) => JsonUtils.jsonToMap<string, string>(response.json));
    }

    public updateData(pk: string, data: Map<string, string>): Promise<Map<string, string>> {
        return this.transport
            .sendRequest(
                this.CLIENT_SET_DATA,
                HttpMethod.Patch, JsonUtils.mapToJson(data)
            )
            .then((response) => JsonUtils.jsonToMap<string, string>(response.json));
    }

    public getFile(pk: string, fileId: number): Promise<string> {
        return this.transport
            .sendRequest(
                this.FILE_GET_FILE.replace('{pk}', pk).replace('{fileId}', fileId.toString()),
                HttpMethod.Get,
            )
            .then(response => (response.originJson as Array<number>)
                .map(ch => String.fromCharCode(ch)).join('')
            );
    }

    public uploadFile(pk: string, file: FileMeta, fileId?: number | null): Promise<FileMeta> {
        let path: string = this.FILE_UPLOAD_FILE.replace('{pk}', pk);
        if (fileId && fileId > 0) {
            path += fileId!.toString() + '/';
        }

        return this.transport
            .sendRequest(path, HttpMethod.Post, pk, file)
            .then((response) => FileMeta.fromJson(response.json));
    }

}
