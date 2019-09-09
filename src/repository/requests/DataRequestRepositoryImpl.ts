import { DataRequest } from '../models/DataRequest';
import { InputGraphData } from '../models/InputGraphData';
import OfferShareData from '../models/OfferShareData';
import { OutputGraphData } from '../models/OutputGraphData';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import { DataRequestRepository } from './DataRequestRepository';

export default class DataRequestRepositoryImpl implements DataRequestRepository {

    private readonly DATA_REQUEST_GRAPH_API: string = '/v1/data/request/graph';
    private readonly DATA_REQUEST: string = '/v1/data/request/';
    private readonly GRANT_ACCESS_FOR_CLIENT: string = '/v1/data/grant/request/';
    private readonly GRANT_ACCESS_FOR_OFFER: string = '/v1/data/grant/offer/';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    public getRequestsGraph(data: InputGraphData): Promise<OutputGraphData> {
        return this.transport.sendRequest<OutputGraphData>(
            this.DATA_REQUEST_GRAPH_API,
            HttpMethod.Post,
            data
        ).then((response) => OutputGraphData.fromJson(response.json));
    }

    public async requestPermissions(toPk: string, dataRequests: Array<DataRequest>): Promise<void> {
        await this.transport.sendRequest(
            this.DATA_REQUEST,
            HttpMethod.Post,
            dataRequests
        );
    }

    public async grantAccessForClient(dataRequests: Array<DataRequest>): Promise<void> {
        await this.transport.sendRequest(
            this.GRANT_ACCESS_FOR_CLIENT,
            HttpMethod.Post,
            dataRequests
        );
    }

    public async revokeAccessForClient(dataRequests: Array<DataRequest>): Promise<void> {
        await this.transport.sendRequest(
            this.GRANT_ACCESS_FOR_CLIENT,
            HttpMethod.Delete,
            dataRequests
        );
    }

    public getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>> {
        const params: Map<string, string | null> = new Map([['toPk', toPk], ['fromPk', fromPk]]);

        const strParams: string = this.joinParams(params);

        return this.transport
            .sendRequest<Array<DataRequest>>(
                this.DATA_REQUEST + `?${strParams}`,
                HttpMethod.Get
            ).then((response) => (response.originJson as Array<DataRequest>)
                .map(item => Object.assign(new DataRequest('', '', '', '', ''), item))
            );
    }

    public async grantAccessForOffer(
        offerSearchId: number,
        clientPk: string,
        encryptedClientResponse: string,
        priceId: number
    ): Promise<void> {
        const shareData = new OfferShareData(offerSearchId, encryptedClientResponse, priceId);
        await this.transport
            .sendRequest(this.GRANT_ACCESS_FOR_OFFER, HttpMethod.Post, shareData);
    }

    private joinParams(params: Map<string, string | null>): string {
        const result: Array<string> = [];
        params.forEach((value, key) => {
            if (!this.isEmpty(value)) {
                result.push(`${key}=${value}`);
            }
        });

        return result.join('&');
    }

    private isEmpty(value: string | null): boolean {
        return value == null || value === undefined || value.trim().length === 0;
    }
}
