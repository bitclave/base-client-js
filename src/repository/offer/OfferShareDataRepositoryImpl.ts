import { AccountManager } from '../../manager/AccountManager';
import { ProfileManager } from '../../manager/ProfileManager';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import { Response } from '../source/http/Response';
import OfferShareData from './../models/OfferShareData';
import { OfferShareDataRepository } from './OfferShareDataRepository';

export default class OfferShareDataRepositoryImpl implements OfferShareDataRepository {

    private readonly SHARE_DATA_API: string = '/v1/data/offer/';
    private readonly NONCE_DATA_API: string = '/v1/nonce/';

    constructor(
        private readonly transport: HttpTransport,
        private readonly accountManager: AccountManager,
        private readonly profileManager: ProfileManager
    ) {
    }

    public async getShareData(owner: string, accepted: boolean): Promise<Array<OfferShareData>> {
        const url = this.SHARE_DATA_API + `?owner=${owner}&accepted=${accepted.toString()}`;
        return this.transport
            .sendRequest(url, HttpMethod.Get)
            .then((response) => Object.keys(response.json)
                .map(key => Object.assign(new OfferShareData(0, '', 0), response.json[key])));
    }

    public async acceptShareData(searchId: number, worth: string): Promise<void> {
        const publicKey: string = this.accountManager
            .getAccount()
            .publicKey;

        const nonceUrl: string = this.NONCE_DATA_API + publicKey;

        const nonceResponse: Response<number> = await this.transport.sendRequest(nonceUrl, HttpMethod.Get);
        let nonce = parseInt(await nonceResponse.json.toString(), 10);

        const acceptUrl: string = this.SHARE_DATA_API + `?offerSearchId=${searchId}`;
        const data = {
            data: worth,
            pk: publicKey,
            sig: await this.profileManager.signMessage(worth),
            nonce: ++nonce
        };
        await this.transport.sendRequest(acceptUrl, HttpMethod.Patch, data);
    }
}
