import { OfferShareDataRepository } from './OfferShareDataRepository';
import OfferShareData from './../models/OfferShareData';
import { AccountManager } from '../../manager/AccountManager';
import { ProfileManager } from '../../manager/ProfileManager';

const fetch = require('node-fetch');

export default class OfferShareDataRepositoryImpl implements OfferShareDataRepository {

    private readonly SHARE_DATA_API: string = '/v1/data/offer/';
    private readonly NONCE_DATA_API: string = '/v1/nonce/';
    private host: string;

    private accountManager: AccountManager;
    private profileManager: ProfileManager;

    constructor(host: string, accountManager: AccountManager, profileManager: ProfileManager) {
        this.host = host;
        this.accountManager = accountManager;
        this.profileManager = profileManager;
    }

    async getShareData(owner: string, accepted: boolean): Promise<Array<OfferShareData>> {
        const url: string = this.host + this.SHARE_DATA_API +
            `?owner=${owner}&accepted=${accepted.toString()}`;

        const response = await fetch(url, {method: 'GET'});
        const json = await response.json();
        const result: Array<OfferShareData> = [];

        for (let item of json) {
            result.push(Object.assign(new OfferShareData(0, '', 0), item));
        }

        return result;
    }

    async acceptShareData(searchId: number, worth: string): Promise<void> {
        const publicKey: string = this.accountManager
            .getAccount()
            .publicKey;

        const nonceUrl: string = this.host + this.NONCE_DATA_API + publicKey;
        const nonceResponse: Response = await fetch(nonceUrl, {method: 'GET'});
        let nonce = parseInt(await nonceResponse.json(), 10);

        const acceptUrl: string = this.host + this.SHARE_DATA_API + `?offerSearchId=${searchId}`;
        const data = {
            data: worth,
            pk: publicKey,
            sig: await this.profileManager.signMessage(worth),
            nonce: ++nonce
        };

        await fetch(
            acceptUrl,
            {
                headers: {'Content-Type': 'application/json'},
                method: 'PATCH',
                body: JSON.stringify(data)
            }
        );
    }

}
