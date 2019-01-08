import { ClientDataRepository } from './ClientDataRepository';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import { JsonUtils } from '../../utils/JsonUtils';
import FileMeta from '../models/FileMeta';

export default class ClientDataRepositoryImpl implements ClientDataRepository {

    private readonly CLIENT_GET_DATA: string = '/v1/client/{pk}/';
    private readonly CLIENT_SET_DATA: string = '/v1/client/';
    private readonly FILE_GET_FILE: string = '/v1/file/{pk}/{fileId}/';
    private readonly FILE_UPLOAD_FILE: string = '/v1/file/{pk}/';

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

    getFile(pk: string, fileId: number): Promise<Buffer> {
        return this.transport
            .sendBlobRequest(
                this.FILE_GET_FILE.replace('{pk}', pk).replace('{fileId}', fileId.toString()),
                HttpMethod.Get,
                new Map<string, string>([
                    ['Accept', 'application/json'], ['Content-Type', 'application/json']
                ]),
                pk
            )
            .then((response) => response.json as Buffer);
    }

    uploadFile(pk: string, file: File, fileId?: number): Promise<FileMeta> {
        let path: string = this.FILE_UPLOAD_FILE.replace('{pk}', pk);
        if(fileId! > 0) {
            path += fileId!.toString() + '/';
        }
        return this.transport
            .sendBlobRequest(
                path,
                HttpMethod.Post, 
                new Map<string, string>([
                    ['Accept', 'application/json'], ['Content-Type', 'multipart/form-data']
                ]),
                pk,
                file
            )
            .then((response) => response.json as FileMeta);
    }

}