import { Site } from '../models/Site';

export interface SiteRepository {

    getSiteData(origin: string): Promise<Site>

}
