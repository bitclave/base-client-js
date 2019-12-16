// tslint:disable:no-unused-expression
import Base, { ExternalService, HttpServiceCall, ServiceCallType } from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { HttpMethod } from '../../src/repository/source/http/HttpMethod';
import SignedRequest from '../../src/repository/source/http/SignedRequest';
import { BaseClientHelper } from '../BaseClientHelper';

require('chai').use(require('chai-as-promised')).should();

describe('External Services Manager', async () => {
    const headers: Map<string, Array<string>> = new Map<string, Array<string>>(
        [
            ['Accept', ['application/json']],
            ['Content-Type', ['application/json']],
            ['Strategy', ['POSTGRES']]
        ]
    );

    let userBase: Base;
    let userAccount: Account;
    let service: ExternalService;

    beforeEach(async () => {
        if (BaseClientHelper.getBaseNodeUrl().includes('http://localhost')) {
            userBase = await BaseClientHelper.createRegistered('someSigMessage');
            userAccount = userBase.accountManager.getAccount();

            const services = await userBase.externalServicesManager.getExternalServices();
            service = services.filter(item => item.endpoint.includes('http://localhost'))[0];
        } else {
            console.log('this test only use locally');
        }
    });

    it('should be call request GET Account', async () => {
        if (!userAccount || !service) {
            return;
        }

        const call = new HttpServiceCall(
            service.publicKey,
            ServiceCallType.HTTP,
            HttpMethod.Get,
            '/v1/account/count',
            new Map(),
            headers
        );

        const result = await userBase.externalServicesManager.callExternalService(call);
        result.status.should.be.eq(200);
        Number(result.body).should.be.gt(0);
    });

    it('should be call request GET with query args', async () => {
        if (!userAccount || !service) {
            return;
        }

        const call = new HttpServiceCall(
            service.publicKey,
            ServiceCallType.HTTP,
            HttpMethod.Get,
            '/v1/search/count',
            new Map([['ids', '2785290']]),
            headers
        );

        const result = await userBase.externalServicesManager.callExternalService(call);
        result.status.should.be.eq(200);
        (result.body as object).hasOwnProperty('2785290').should.be.true;
    });

    // we have some strange behavior in convert JSON Object to Unrecognized Object with Number fields to POJO.
    // Number '0' will convert to Double '0.0' in GSON library.
    // PR for fix it https://github.com/google/gson/pull/1290
    it('should be call request POST', async () => {
        if (!userAccount || !service) {
            return;
        }

        const base = await BaseClientHelper.createRegistered('my super pass');
        const account = base.accountManager.getAccount();
        const sig = await base.profileManager.signMessage(JSON.stringify(account.toSimpleAccount()));

        const body = new SignedRequest(
            account.toSimpleAccount(),
            account.publicKey,
            sig,
            0
        );

        const call = new HttpServiceCall(
            service.publicKey,
            ServiceCallType.HTTP,
            HttpMethod.Post,
            '/v1/lazy-registration',
            new Map(),
            headers,
            body
        );

        const result = await userBase.externalServicesManager.callExternalService(call);
        result.status.should.be.eq(403); // when fix GSON change to 201
        // Number(result.body).should.be.gt(0);
    });
});
