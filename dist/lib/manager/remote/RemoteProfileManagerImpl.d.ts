import { DataRequest } from '../../repository/models/DataRequest';
import { FileMeta } from '../../repository/models/FileMeta';
import { SharedData } from '../../repository/models/SharedData';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { ProfileManager } from '../ProfileManager';
export declare class RemoteProfileManagerImpl implements ProfileManager {
    private readonly transport;
    constructor(transport: RpcTransport);
    decryptMessage(senderPk: string, encryptedMessage: string): Promise<string>;
    downloadFile(id: number, key: string, publicKey?: string, existedPassword?: string): Promise<string>;
    encryptMessage(recipientPk: string, message: string): Promise<string>;
    getAuthorizedData(acceptedRequests: Array<DataRequest>): Promise<SharedData>;
    getAuthorizedEncryptionKeys(encryptedData: Array<DataRequest>): Promise<SharedData>;
    getData(fieldKey?: string | Array<string>): Promise<Map<string, string>>;
    getFileMetaWithGivenKey(key: string): Promise<FileMeta | undefined>;
    getRawData(anyPublicKey: string, fieldKey?: string | Array<string>): Promise<Map<string, string>>;
    signMessage(data: string): Promise<string>;
    updateData(data: Map<string, string>): Promise<Map<string, string>>;
    uploadFile(file: FileMeta, key: string): Promise<FileMeta>;
}
