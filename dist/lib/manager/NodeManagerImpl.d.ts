import { AssistantNodeRepository } from '../repository/assistant/AssistantNodeRepository';
import { DataRequest } from '../repository/models/DataRequest';
import { Site } from '../repository/models/Site';
import { NodeManager } from './NodeManager';
export declare class NodeManagerImpl implements NodeManager {
    private readonly assistant;
    constructor(assistant: AssistantNodeRepository);
    getGrandAccessRecords(publicKeyFrom: string, publicKeyTo: string): Promise<Array<DataRequest>>;
    getNodeVersion(): Promise<string>;
    getNonce(publicKey: string): Promise<number>;
    getSiteData(origin: string): Promise<Site>;
}
