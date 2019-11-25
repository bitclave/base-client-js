import { DataRequest } from '../../repository/models/DataRequest';
import { FileMeta } from '../../repository/models/FileMeta';
import { SharedData } from '../../repository/models/SharedData';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { SimpleMapDeserializer } from '../../utils/types/json-transform/deserializers/SimpleMapDeserializer';
import { ProfileManager } from '../ProfileManager';

export class RemoteProfileManagerImpl implements ProfileManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public decryptMessage(senderPk: string, encryptedMessage: string): Promise<string> {
        return this.transport.request('decryptMessage', [senderPk, encryptedMessage]);
    }

    public downloadFile(id: number, key: string, publicKey?: string, existedPassword?: string): Promise<string> {
        return this.transport.request('downloadFile', [id, key, publicKey, existedPassword]);
    }

    public encryptMessage(recipientPk: string, message: string): Promise<string> {
        return this.transport.request('downloadFile', [recipientPk, message]);
    }

    public getAuthorizedData(acceptedRequests: Array<DataRequest>): Promise<SharedData> {
        const requests = acceptedRequests.map(item => item.toJson());
        return this.transport.request('getAuthorizedData', [requests], SharedData);
    }

    public getAuthorizedEncryptionKeys(encryptedData: Array<DataRequest>): Promise<SharedData> {
        const data = encryptedData.map(item => item.toJson());
        return this.transport.request('getAuthorizedEncryptionKeys', [data], SharedData);
    }

    public getData(fieldKey?: string | Array<string>): Promise<Map<string, string>> {
        return this.transport.request('getAuthorizedEncryptionKeys', [fieldKey], new SimpleMapDeserializer());
    }

    public getFileMetaWithGivenKey(key: string): Promise<FileMeta | undefined> {
        return this.transport.request('getFileMetaWithGivenKey', [key], FileMeta);
    }

    public getRawData(anyPublicKey: string, fieldKey?: string | Array<string>): Promise<Map<string, string>> {
        return this.transport.request('getRawData', [anyPublicKey], new SimpleMapDeserializer());
    }

    public signMessage(data: string): Promise<string> {
        return this.transport.request('signMessage', [data]);
    }

    public updateData(data: Map<string, string>): Promise<Map<string, string>> {
        return this.transport.request('updateData', [data], new SimpleMapDeserializer());
    }

    public uploadFile(file: FileMeta, key: string): Promise<FileMeta> {
        return this.transport.request('uploadFile', [file, key], FileMeta);
    }
}
