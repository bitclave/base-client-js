import { ExternalService } from '../repository/models/services/ExternalService';
import { ServiceCall } from '../repository/models/services/ServiceCall';
import { ServiceResponse } from '../repository/models/services/ServiceResponse';
import { ExternalServicesRepository } from '../repository/services/ExternalServicesRepository';
import { ExportMethod } from '../utils/ExportMethod';
import { ExternalServicesManager } from './ExternalServicesManager';

export class ExternalServicesManagerImpl implements ExternalServicesManager {

    constructor(private readonly repository: ExternalServicesRepository) {
    }

    @ExportMethod()
    public callExternalService(serviceCall: ServiceCall): Promise<ServiceResponse> {
        return this.repository.callExternalService(serviceCall);
    }

    @ExportMethod()
    public getExternalServices(): Promise<Array<ExternalService>> {
        return this.repository.getExternalServices();
    }
}
