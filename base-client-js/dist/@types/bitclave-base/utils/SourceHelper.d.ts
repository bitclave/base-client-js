import { HttpTransport } from '../repository/source/http/HttpTransport';
import { NonceSource } from '../repository/source/NonceSource';
import { PermissionsSource } from '../repository/source/PermissionsSource';
import DataRequest from '../repository/models/DataRequest';
export default class SourceHelper implements NonceSource, PermissionsSource {
    private readonly GET_NONCE;
    private readonly GET_DATA_REQUEST_FROM_TO;
    private httpTransport;
    constructor(httpTransport: HttpTransport);
    getNonce(publicKey: string): Promise<number>;
    getGrandAccessRecords(publicKeyFrom: string, publicKeyTo: string): Promise<Array<DataRequest>>;
}
