import { AssistantNodeRepository } from '../repository/assistant/AssistantNodeRepository';
import { DataRequest } from '../repository/models/DataRequest';
import { Site } from '../repository/models/Site';
import { ExportMethod } from '../utils/ExportMethod';
import { NodeManager } from './NodeManager';

export class NodeManagerImpl implements NodeManager {

    constructor(private readonly assistant: AssistantNodeRepository) {
    }

    @ExportMethod({public: true})
    public getGrandAccessRecords(publicKeyFrom: string, publicKeyTo: string): Promise<Array<DataRequest>> {
        return this.assistant.getGrandAccessRecords(publicKeyFrom, publicKeyTo);
    }

    @ExportMethod({public: true})
    public getNodeVersion(): Promise<string> {
        return this.assistant.getNodeVersion();
    }

    @ExportMethod({public: true})
    public getNonce(publicKey: string): Promise<number> {
        return this.assistant.getNonce(publicKey);
    }

    @ExportMethod({public: true})
    public getSiteData(origin: string): Promise<Site> {
        return this.assistant.getSiteData(origin);
    }
}
