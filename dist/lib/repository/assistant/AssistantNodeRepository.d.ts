import { AccountRepository } from '../account/AccountRepository';
import { DataRequest } from '../models/DataRequest';
import { Site } from '../models/Site';
import { DataRequestRepository } from '../requests/DataRequestRepository';
import { SiteRepository } from '../site/SiteRepository';
import { NonceSource } from './NonceSource';
import { PermissionsSource } from './PermissionsSource';
import { SiteDataSource } from './SiteDataSource';
export declare class AssistantNodeRepository implements PermissionsSource, NonceSource, SiteDataSource {
    private accountRepository;
    private dataRequestRepository;
    private siteRepository;
    constructor(accountRepository: AccountRepository, dataRequestRepository: DataRequestRepository, siteRepository: SiteRepository);
    getGrandAccessRecords(publicKeyFrom: string, publicKeyTo: string): Promise<Array<DataRequest>>;
    getNonce(publicKey: string): Promise<number>;
    getSiteData(origin: string): Promise<Site>;
}
