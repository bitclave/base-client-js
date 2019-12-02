import { DataRequest } from '../../repository/models/DataRequest';
import { FileMeta } from '../../repository/models/FileMeta';
import { SharedData } from '../../repository/models/SharedData';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { JsonUtils } from '../../utils/JsonUtils';
import { SimpleMapDeserializer } from '../../utils/types/json-transform/deserializers/SimpleMapDeserializer';
import { ProfileManager } from '../ProfileManager';

export class RemoteProfileManagerImpl implements ProfileManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public decryptMessage(senderPk: string, encryptedMessage: string): Promise<string> {
        return this.transport.request('profileManager.decryptMessage', [senderPk, encryptedMessage]);
    }

    public downloadFile(id: number, key: string, publicKey?: string, existedPassword?: string): Promise<string> {
        return this.transport.request('profileManager.downloadFile', [id, key, publicKey, existedPassword]);
    }

    public encryptMessage(recipientPk: string, message: string): Promise<string> {
        return this.transport.request('profileManager.downloadFile', [recipientPk, message]);
    }

    public getAuthorizedData(acceptedRequests: Array<DataRequest>): Promise<SharedData> {
        const requests = acceptedRequests.map(item => item.toJson());

        return this.transport.request('profileManager.getAuthorizedData', [requests], SharedData);
    }

    public getAuthorizedEncryptionKeys(encryptedData: Array<DataRequest>): Promise<SharedData> {
        const data = encryptedData.map(item => item.toJson());
        return this.transport.request('profileManager.getAuthorizedEncryptionKeys', [data], SharedData);
    }

    public getData(fieldKey?: string | Array<string>): Promise<Map<string, string>> {
        return this.transport.request(
            'profileManager.getData',
            [fieldKey],
            new SimpleMapDeserializer()
        );
    }

    public getFileMetaWithGivenKey(key: string): Promise<FileMeta | undefined> {
        return this.transport.request('profileManager.getFileMetaWithGivenKey', [key], FileMeta);
    }

    public getRawData(anyPublicKey: string, fieldKey?: string | Array<string>): Promise<Map<string, string>> {
        return this.transport.request(
            'profileManager.getRawData',
            [anyPublicKey, fieldKey],
            new SimpleMapDeserializer()
        );
    }

    public signMessage(data: string): Promise<string> {
        return this.transport.request('profileManager.signMessage', [data]);
    }

    public updateData(data: Map<string, string>): Promise<Map<string, string>> {
        return this.transport.request(
            'profileManager.updateData',
            [JsonUtils.mapToJson(data)],
            new SimpleMapDeserializer()
        );
    }

    public uploadFile(file: FileMeta, key: string): Promise<FileMeta> {
        return this.transport.request('profileManager.uploadFile', [file, key], FileMeta);
    }
}
