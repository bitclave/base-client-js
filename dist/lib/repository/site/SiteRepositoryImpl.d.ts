import { Site } from '../models/Site';
import { HttpTransport } from '../source/http/HttpTransport';
import { SiteRepository } from './SiteRepository';
export declare class SiteRepositoryImpl implements SiteRepository {
    private readonly GET_SITE_DATA_API;
    private transport;
    constructor(transport: HttpTransport);
    getSiteData(origin: string): Promise<Site>;
}
