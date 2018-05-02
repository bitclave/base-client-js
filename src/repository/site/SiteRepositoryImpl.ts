import { SiteRepository } from './SiteRepository';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import { Site } from '../models/Site';

export class SiteRepositoryImpl implements SiteRepository {

    private readonly GET_SITE_DATA_API: string = '/v1/site/{origin}';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    getSiteData(origin: string): Promise<Site> {
        return this.transport.sendRequest(
            this.GET_SITE_DATA_API.replace('{origin}', origin),
            HttpMethod.Get
        ).then((response) => Object.assign(new Site(), response.json));
    }

}
