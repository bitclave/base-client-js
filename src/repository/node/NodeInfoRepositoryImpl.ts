import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import { NodeInfoRepository } from './NodeInfoRepository';

export class NodeInfoRepositoryImpl implements NodeInfoRepository {

    private readonly NODE_VERSION: string = '/ver';

    constructor(private readonly transport: HttpTransport) {
    }

    public getNodeVersion(): Promise<string> {
        return this.transport.sendRequest<string>(
            this.NODE_VERSION,
            HttpMethod.Get,
        ).then((response) => response.originJson.toString());
    }
}
