import { ExternalService } from '../repository/models/services/ExternalService';
import { ServiceCall } from '../repository/models/services/ServiceCall';
import { ServiceResponse } from '../repository/models/services/ServiceResponse';
export interface ExternalServicesManager {
    callExternalService(serviceCall: ServiceCall): Promise<ServiceResponse>;
    getExternalServices(): Promise<Array<ExternalService>>;
}
