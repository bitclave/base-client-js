import { ExternalService } from '../models/services/ExternalService';
import { ServiceCall } from '../models/services/ServiceCall';
import { ServiceResponse } from '../models/services/ServiceResponse';
import { HttpTransport } from '../source/http/HttpTransport';
import { ExternalServicesRepository } from './ExternalServicesRepository';
export declare class ExternalServicesRepositoryImpl implements ExternalServicesRepository {
    private readonly EXTERNAL_SERVICES_API;
    private transport;
    constructor(transport: HttpTransport);
    callExternalService(serviceCall: ServiceCall): Promise<ServiceResponse>;
    getExternalServices(): Promise<Array<ExternalService>>;
}
