import { ExternalService } from '../repository/models/services/ExternalService';
import { ServiceCall } from '../repository/models/services/ServiceCall';
import { ServiceResponse } from '../repository/models/services/ServiceResponse';
import { ExternalServicesRepository } from '../repository/services/ExternalServicesRepository';
import { ExternalServicesManager } from './ExternalServicesManager';

export class ExternalServicesManagerImpl implements ExternalServicesManager {

    private repository: ExternalServicesRepository;

    constructor(externalServicesRepository: ExternalServicesRepository) {
        this.repository = externalServicesRepository;
    }

    public callExternalService(serviceCall: ServiceCall): Promise<ServiceResponse> {
        return this.repository.callExternalService(serviceCall);
    }

    public getExternalServices(): Promise<Array<ExternalService>> {
        return this.repository.getExternalServices();
    }
}
