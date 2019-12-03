import { AccountRepository } from '../account/AccountRepository';
import { DataRequest } from '../models/DataRequest';
import { Site } from '../models/Site';
import { NodeInfoRepository } from '../node/NodeInfoRepository';
import { DataRequestRepository } from '../requests/DataRequestRepository';
import { SiteRepository } from '../site/SiteRepository';
import { NodeInfo } from './NodeInfo';
import { NonceSource } from './NonceSource';
import { PermissionsSource } from './PermissionsSource';
import { SiteDataSource } from './SiteDataSource';
export declare class AssistantNodeRepository implements PermissionsSource, NonceSource, SiteDataSource, NodeInfo {
    private readonly accountRepository;
    private readonly dataRequestRepository;
    private readonly siteRepository;
    private readonly nodeInfoRepository;
    constructor(accountRepository: AccountRepository, dataRequestRepository: DataRequestRepository, siteRepository: SiteRepository, nodeInfoRepository: NodeInfoRepository);
    getGrandAccessRecords(publicKeyFrom: string, publicKeyTo: string): Promise<Array<DataRequest>>;
    getNonce(publicKey: string): Promise<number>;
    getSiteData(origin: string): Promise<Site>;
    getNodeVersion(): Promise<string>;
}
