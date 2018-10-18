import { PermissionsSource } from '../../src/repository/assistant/PermissionsSource';
import { SiteDataSource } from '../../src/repository/assistant/SiteDataSource';
import { DataRequestRepository } from '../../src/repository/requests/DataRequestRepository';
import { Site } from '../../src/repository/models/Site';
import DataRequest from '../../src/repository/models/DataRequest';

export class AssistantPermissions implements PermissionsSource, SiteDataSource {

    private dataRequestRepository: DataRequestRepository;
    private siteDataMap: Map<string, Site>;

    constructor(dataRequestRepository: DataRequestRepository) {
        this.siteDataMap = new Map();
        this.dataRequestRepository = dataRequestRepository;
    }

    public getGrandAccessRecords(publicKeyFrom: string, publicKeyTo: string): Promise<Array<DataRequest>> {
        return this.dataRequestRepository.getRequests(publicKeyFrom, publicKeyTo);
    }

    public getSiteData(origin: string): Promise<Site> {
        return Promise.resolve(this.siteDataMap.get(origin.toLowerCase()) || new Site());
    }

    public setSiteData(siteData: Site) {
        this.siteDataMap.set(siteData.origin.toLowerCase(), siteData);
    }

    public clearData() {
        this.siteDataMap.clear();
    }
}
