import { FileMeta } from '../models/FileMeta';
import { HttpTransport } from '../source/http/HttpTransport';
import { ClientDataRepository } from './ClientDataRepository';
export default class ClientDataRepositoryImpl implements ClientDataRepository {
    private readonly CLIENT_GET_DATA;
    private readonly CLIENT_SET_DATA;
    private readonly FILE_GET_FILE;
    private readonly FILE_UPLOAD_FILE;
    private transport;
    constructor(transport: HttpTransport);
    getData(pk: string, fieldKey?: string | Array<string>): Promise<Map<string, string>>;
    updateData(pk: string, data: Map<string, string>): Promise<Map<string, string>>;
    getFile(pk: string, fileId: number): Promise<string>;
    uploadFile(pk: string, file: FileMeta, fileId?: number | null): Promise<FileMeta>;
}
