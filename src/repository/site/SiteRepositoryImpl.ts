import { Site } from '../models/Site';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import { SiteRepository } from './SiteRepository';

export class SiteRepositoryImpl implements SiteRepository {

    private readonly GET_SITE_DATA_API: string = '/v1/site/{origin}';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    public getSiteData(origin: string): Promise<Site> {
        return this.transport.sendRequest(
            this.GET_SITE_DATA_API.replace('{origin}', origin),
            HttpMethod.Get
        ).then((response) => Object.assign(new Site(), response.json));
    }

}
