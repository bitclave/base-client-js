import { AccountRepository } from '../account/AccountRepository';
import Account from '../models/Account';
import { DataRequest } from '../models/DataRequest';
import { Site } from '../models/Site';
import { NodeInfoRepository } from '../node/NodeInfoRepository';
import { DataRequestRepository } from '../requests/DataRequestRepository';
import { SiteRepository } from '../site/SiteRepository';
import { NodeInfo } from './NodeInfo';
import { NonceSource } from './NonceSource';
import { PermissionsSource } from './PermissionsSource';
import { SiteDataSource } from './SiteDataSource';

// this class assistant for only read data from Base-node. without any permissions
export class AssistantNodeRepository implements PermissionsSource, NonceSource, SiteDataSource, NodeInfo {

    public constructor(
        private readonly accountRepository: AccountRepository,
        private readonly dataRequestRepository: DataRequestRepository,
        private readonly siteRepository: SiteRepository,
        private readonly nodeInfoRepository: NodeInfoRepository
    ) {

    }

    public getGrandAccessRecords(publicKeyFrom: string, publicKeyTo: string): Promise<Array<DataRequest>> {
        return this.dataRequestRepository.getRequests(publicKeyFrom, publicKeyTo);
    }

    public getNonce(publicKey: string): Promise<number> {
        return this.accountRepository.getNonce(new Account(publicKey));
    }

    public getSiteData(origin: string): Promise<Site> {
        return this.siteRepository.getSiteData(origin);
    }

    public getNodeVersion(): Promise<string> {
        return this.nodeInfoRepository.getNodeVersion();
    }
}
