import { ExternalService } from '../models/services/ExternalService';
import { ServiceCall } from '../models/services/ServiceCall';
import { ServiceResponse } from '../models/services/ServiceResponse';
export interface ExternalServicesRepository {
    callExternalService(serviceCall: ServiceCall): Promise<ServiceResponse>;
    getExternalServices(): Promise<Array<ExternalService>>;
}
