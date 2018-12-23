import { SiteRepository } from './SiteRepository';
import { HttpTransport } from '../source/http/HttpTransport';
import { Site } from '../models/Site';
export declare class SiteRepositoryImpl implements SiteRepository {
    private readonly GET_SITE_DATA_API;
    private transport;
    constructor(transport: HttpTransport);
    getSiteData(origin: string): Promise<Site>;
}
