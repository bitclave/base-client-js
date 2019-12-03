import { ExternalService } from '../../repository/models/services/ExternalService';
import { ServiceCall } from '../../repository/models/services/ServiceCall';
import { ServiceResponse } from '../../repository/models/services/ServiceResponse';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { ExternalServicesManager } from '../ExternalServicesManager';
export declare class RemoteExternalServicesManagerImpl implements ExternalServicesManager {
    private readonly transport;
    constructor(transport: RpcTransport);
    callExternalService(serviceCall: ServiceCall): Promise<ServiceResponse>;
    getExternalServices(): Promise<Array<ExternalService>>;
}
