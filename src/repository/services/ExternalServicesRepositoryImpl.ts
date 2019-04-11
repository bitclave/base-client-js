import { ExternalService } from '../models/services/ExternalService';
import { ServiceCall } from '../models/services/ServiceCall';
import { ServiceResponse } from '../models/services/ServiceResponse';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import { ExternalServicesRepository } from './ExternalServicesRepository';

export class ExternalServicesRepositoryImpl implements ExternalServicesRepository {

    private readonly EXTERNAL_SERVICES_API: string = '/v1/services/';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    public callExternalService(serviceCall: ServiceCall): Promise<ServiceResponse> {
        return this.transport.sendRequest(
            this.EXTERNAL_SERVICES_API,
            HttpMethod.Post,
            serviceCall.toJson()
        ).then((response) => ServiceResponse.fromJson(response.json));
    }

    public getExternalServices(): Promise<Array<ExternalService>> {
        return this.transport.sendRequest(
            this.EXTERNAL_SERVICES_API,
            HttpMethod.Get
        ).then((response) => Object.keys(response.json)
            .map(key => Object.assign(new ExternalService(), response.json[key]))
        );
    }
}
