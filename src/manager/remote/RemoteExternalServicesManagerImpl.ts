import { ExternalService } from '../../repository/models/services/ExternalService';
import { ServiceCall } from '../../repository/models/services/ServiceCall';
import { ServiceResponse } from '../../repository/models/services/ServiceResponse';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { ArrayDeserializer } from '../../utils/types/json-transform/deserializers/ArrayDeserializer';
import { ExternalServicesManager } from '../ExternalServicesManager';

export class RemoteExternalServicesManagerImpl implements ExternalServicesManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public callExternalService(serviceCall: ServiceCall): Promise<ServiceResponse> {
        return this.transport.request('callExternalService', [serviceCall.toJson()], ServiceResponse);
    }

    public getExternalServices(): Promise<Array<ExternalService>> {
        return this.transport.request('getExternalServices', [], new ArrayDeserializer(ExternalService));
    }
}
