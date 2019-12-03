import { DataRequest } from '../../repository/models/DataRequest';
import { FieldData } from '../../repository/models/FieldData';
import { InputGraphData } from '../../repository/models/InputGraphData';
import { OutputGraphData } from '../../repository/models/OutputGraphData';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { AccessRight } from '../../utils/keypair/Permissions';
import { DataRequestManager } from '../DataRequestManager';
export declare class RemoteDataRequestManagerImpl implements DataRequestManager {
    private readonly transport;
    constructor(transport: RpcTransport);
    decryptMessage(senderPk: string, encrypted: string): Promise<object | string>;
    getGrantedPermissions(clientPk: string): Promise<Array<string>>;
    getGrantedPermissionsToMe(clientPk: string): Promise<Array<string>>;
    getRequestedPermissions(requestedFromPk?: string | undefined): Promise<Array<FieldData>>;
    getRequestedPermissionsToMe(whoRequestedPk?: string | undefined): Promise<Array<FieldData>>;
    getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>>;
    getRequestsGraph(data: InputGraphData): Promise<OutputGraphData>;
    grantAccessForClient(clientPk: string, acceptedFields: Map<string, AccessRight>, rootPk?: string): Promise<void>;
    grantAccessForOffer(offerSearchId: number, offerOwner: string, acceptedFields: Map<string, AccessRight>, priceId: number): Promise<void>;
    requestPermissions(recipientPk: string, fields: Array<string>): Promise<void>;
    revokeAccessForClient(clientPk: string, revokeFields: Array<string>): Promise<void>;
}
