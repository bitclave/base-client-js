import { OfferShareDataRepository } from './OfferShareDataRepository';
import OfferShareData from './../models/OfferShareData';
import { AccountManager } from '../../manager/AccountManager';
import { ProfileManager } from '../../manager/ProfileManager';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import { Response } from './../source/http/Response';

export default class OfferShareDataRepositoryImpl implements OfferShareDataRepository {

    private readonly SHARE_DATA_API: string = '/v1/data/offer/';
    private readonly NONCE_DATA_API: string = '/v1/nonce/';
    private transport: HttpTransport;

    private accountManager: AccountManager;
    private profileManager: ProfileManager;

    constructor(transport: HttpTransport, accountManager: AccountManager, profileManager: ProfileManager) {
        this.transport = transport;
        this.accountManager = accountManager;
        this.profileManager = profileManager;
    }

    async getShareData(owner: string, accepted: boolean): Promise<Array<OfferShareData>> {
        const url = this.SHARE_DATA_API + `?owner=${owner}&accepted=${accepted.toString()}`;
        return this.transport
          .sendRequest(url, HttpMethod.Get)
          .then( (response: Response) => {
            const result: Array<OfferShareData> = [];
            for (let item of (response.json as Array<any>)) {
                result.push(Object.assign(new OfferShareData(0, '', 0), item));
            }
            return result;
          });
    }

    async acceptShareData(searchId: number, worth: string): Promise<void> {
        const publicKey: string = this.accountManager
            .getAccount()
            .publicKey;

        const nonceUrl: string = this.NONCE_DATA_API + publicKey;

        const nonceResponse: Response = await this.transport.sendRequest (nonceUrl, HttpMethod.Get);
        let nonce = parseInt(await nonceResponse.json.toString(), 10);

        const acceptUrl: string = this.SHARE_DATA_API + `?offerSearchId=${searchId}`;
        const data = {
            data: worth,
            pk: publicKey,
            sig: await this.profileManager.signMessage(worth),
            nonce: ++nonce
        };
        await this.transport.sendRequest(acceptUrl, HttpMethod.Patch, data);

        // await fetch(
        //     acceptUrl,
        //     {
        //         headers: {'Content-Type': 'application/json'},
        //         method: 'PATCH',
        //         body: JSON.stringify(data)
        //     }
        // );
    }

}
