import { AccountRepository } from '../account/AccountRepository';
import { DataRequestRepository } from '../requests/DataRequestRepository';
import { PermissionsSource } from './PermissionsSource';
import { NonceSource } from './NonceSource';
import DataRequest from '../models/DataRequest';
import { SiteDataSource } from './SiteDataSource';
import { SiteRepository } from '../site/SiteRepository';
import { Site } from '../models/Site';
export declare class AssistantNodeRepository implements PermissionsSource, NonceSource, SiteDataSource {
    private accountRepository;
    private dataRequestRepository;
    private siteRepository;
    constructor(accountRepository: AccountRepository, dataRequestRepository: DataRequestRepository, siteRepository: SiteRepository);
    getGrandAccessRecords(publicKeyFrom: string, publicKeyTo: string): Promise<Array<DataRequest>>;
    getNonce(publicKey: string): Promise<number>;
    getSiteData(origin: string): Promise<Site>;
}
