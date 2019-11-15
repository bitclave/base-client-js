import { ExternalService } from '../repository/models/services/ExternalService';
import { ServiceCall } from '../repository/models/services/ServiceCall';
import { ServiceResponse } from '../repository/models/services/ServiceResponse';
import { ExternalServicesRepository } from '../repository/services/ExternalServicesRepository';
import { ExternalServicesManager } from './ExternalServicesManager';
export declare class ExternalServicesManagerImpl implements ExternalServicesManager {
    private repository;
    constructor(externalServicesRepository: ExternalServicesRepository);
    callExternalService(serviceCall: ServiceCall): Promise<ServiceResponse>;
    getExternalServices(): Promise<Array<ExternalService>>;
}
