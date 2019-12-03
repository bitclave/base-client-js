import { HttpTransport } from '../source/http/HttpTransport';
import { NodeInfoRepository } from './NodeInfoRepository';
export declare class NodeInfoRepositoryImpl implements NodeInfoRepository {
    private readonly transport;
    private readonly NODE_VERSION;
    constructor(transport: HttpTransport);
    getNodeVersion(): Promise<string>;
}
