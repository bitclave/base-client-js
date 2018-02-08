import { List } from 'lodash';
import { DataRequestRepository } from '../repository/requests/DataRequestRepository';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { DataRequestState } from '../repository/models/DataRequestState';
import JsonUtils from '../utils/JsonUtils';
import DataRequest from '../repository/models/DataRequest';

export default class DataRequestManager {

    private dataRequestRepository: DataRequestRepository;
    private encrypt: MessageEncrypt;
    private decrypt: MessageDecrypt;

    constructor(dataRequestRepository: DataRequestRepository,
                encrypt: MessageEncrypt, decrypt: MessageDecrypt) {
        this.dataRequestRepository = dataRequestRepository;
        this.encrypt = encrypt;
        this.decrypt = decrypt;
    }

    public createRequest(recipientPk: string, fields: List<string>): Promise<string> {
        const encrypted = this.encrypt
            .encryptMessage(recipientPk, JSON.stringify(fields).toLowerCase());

        return this.dataRequestRepository.createRequest(recipientPk, encrypted);
    }

    public responseToRequest(requestId: number, senderPk: string,
                             fields?: Array<string>): Promise<DataRequestState> {
        let encrypt = '';

        if (fields != null && fields.length > 0) {
            const resultMap: Map<string, string> = new Map();
            fields.forEach(value => {
                resultMap.set(value, this.encrypt.generatePasswordForFiled(value.toLowerCase()));
            });

            const jsonMap: any = JsonUtils.mapToJson(resultMap);
            encrypt = this.encrypt
                .encryptMessage(senderPk, JSON.stringify(jsonMap));
        }

        return this.dataRequestRepository.createResponse(requestId, encrypt);
    }

    public getRequests(fromPk: string = '', toPk: string = '', state: DataRequestState): Promise<Array<DataRequest>> {
        return this.dataRequestRepository.getRequests(fromPk, toPk, state);
    }

    public decryptMessage<T>(senderPk: string, encrypted: string): T {
        const decrypted = this.decrypt.decryptMessage(senderPk, encrypted);
        try {
            return JSON.parse(decrypted);
        } catch (e) {
            console.log(decrypted, e);
            return {} as T;
        }
    }

}
