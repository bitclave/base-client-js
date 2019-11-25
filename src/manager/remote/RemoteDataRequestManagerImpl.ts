import { DataRequest } from '../../repository/models/DataRequest';
import { FieldData } from '../../repository/models/FieldData';
import { InputGraphData } from '../../repository/models/InputGraphData';
import { OutputGraphData } from '../../repository/models/OutputGraphData';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { JsonUtils } from '../../utils/JsonUtils';
import { AccessRight } from '../../utils/keypair/Permissions';
import { ArrayDeserializer } from '../../utils/types/json-transform/deserializers/ArrayDeserializer';
import { DataRequestManager } from '../DataRequestManager';

export class RemoteDataRequestManagerImpl implements DataRequestManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public decryptMessage(senderPk: string, encrypted: string): Promise<object | string> {
        return this.transport.request('decryptMessage', [senderPk, encrypted]);
    }

    public getGrantedPermissions(clientPk: string): Promise<Array<string>> {
        return this.transport.request('getGrantedPermissions', [clientPk]);
    }

    public getGrantedPermissionsToMe(clientPk: string): Promise<Array<string>> {
        return this.transport.request('getGrantedPermissionsToMe', [clientPk]);
    }

    public getRequestedPermissions(requestedFromPk?: string | undefined): Promise<Array<FieldData>> {
        return this.transport.request('getGrantedPermissionsToMe', [requestedFromPk]);
    }

    public getRequestedPermissionsToMe(whoRequestedPk?: string | undefined): Promise<Array<FieldData>> {
        return this.transport.request(
            'getRequestedPermissionsToMe',
            [whoRequestedPk],
            new ArrayDeserializer(FieldData)
        );
    }

    public getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>> {
        return this.transport.request('getRequests', [fromPk, toPk], new ArrayDeserializer(DataRequest));
    }

    public getRequestsGraph(data: InputGraphData): Promise<OutputGraphData> {
        return this.transport.request('getRequestsGraph', [data.toJson()], OutputGraphData);
    }

    public grantAccessForClient(
        clientPk: string,
        acceptedFields: Map<string, AccessRight>,
        rootPk?: string
    ): Promise<void> {
        return this.transport.request('grantAccessForClient', [clientPk, JsonUtils.mapToJson(acceptedFields), rootPk]);
    }

    public grantAccessForOffer(
        offerSearchId: number,
        offerOwner: string,
        acceptedFields: Map<string, AccessRight>,
        priceId: number
    ): Promise<void> {
        return this.transport.request(
            'grantAccessForOffer',
            [offerSearchId, offerOwner, JsonUtils.mapToJson(acceptedFields), priceId]
        );
    }

    public requestPermissions(recipientPk: string, fields: Array<string>): Promise<void> {
        return this.transport.request('requestPermissions', [recipientPk, fields]);
    }

    public revokeAccessForClient(clientPk: string, revokeFields: Array<string>): Promise<void> {
        return this.transport.request('revokeAccessForClient', [clientPk, revokeFields]);
    }
}
