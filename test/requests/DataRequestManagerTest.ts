import { KeyPairFactory } from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { DataRequestManager } from '../../src/manager/DataRequestManager';
import DataRequestRepositoryImplMock from './DataRequestRepositoryImplMock';
import { DataRequestState } from '../../src/repository/models/DataRequestState';
import { JsonUtils } from '../../src/utils/JsonUtils';
import { BehaviorSubject } from 'rxjs/Rx';
import Account from '../../src/repository/models/Account';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { RpcTransportImpl } from '../../src/repository/source/rpc/RpcTransportImpl';
import { HttpTransportImpl } from '../../src/repository/source/http/HttpTransportImpl';
import * as assert from 'assert';
import AuthenticatorHelper from '../AuthenticatorHelper';
import { RemoteSigner } from '../../src/utils/keypair/RemoteSigner';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Data Request Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const rpcSignerHost: string = 'http://localhost:3545';
    const rpcTransport: RpcTransport = new RpcTransportImpl(new HttpTransportImpl(rpcSignerHost));
    const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const keyPairHelperBob: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const dataRepository: DataRequestRepositoryImplMock = new DataRequestRepositoryImplMock();

    const bobsFields = ['name', 'email'];
    const alisaFields = ['email'];

    const accountBob: Account;
    const authAccountBehaviorBob: BehaviorSubject<Account>;
    const requestManager: DataRequestManager;

    before(async () => {
        const alisaAccessToken = await authenticatorHelper.generateAccessToken(passPhraseAlisa);
        const bobAccessToken = await authenticatorHelper.generateAccessToken(passPhraseBob);

        (keyPairHelperAlisa as RemoteSigner).setAccessToken(alisaAccessToken);
        (keyPairHelperBob as RemoteSigner).setAccessToken(bobAccessToken);

        await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
        await keyPairHelperBob.createKeyPair(passPhraseBob);

        accountBob = new Account(keyPairHelperBob.getPublicKey());
        authAccountBehaviorBob = new BehaviorSubject<Account>(accountBob);

        dataRepository.setPK(keyPairHelperAlisa.getPublicKey(), keyPairHelperBob.getPublicKey());

        requestManager = new DataRequestManager(
            dataRepository,
            authAccountBehaviorBob,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );
    });

    beforeEach((done) => {
        dataRepository.clearData();
        done();
    });

    after(async () => {
        rpcTransport.disconnect();
    });

    it('create request data', async () => {
        await requestManager.createRequest(keyPairHelperBob.getPublicKey(), bobsFields);
        const requestsByFrom = await requestManager.getRequests(
            keyPairHelperAlisa.getPublicKey(),
            null,
            DataRequestState.AWAIT
        );
        const requestsByTo = await requestManager.getRequests(
            null,
            keyPairHelperBob.getPublicKey(),
            DataRequestState.AWAIT
        );

        requestsByFrom.should.be.deep.equal(requestsByTo);

        requestsByFrom[0].requestData.should.be.not.equal(bobsFields);
        const decryptedStr = await keyPairHelperBob.decryptMessage(
            keyPairHelperAlisa.getPublicKey(),
            requestsByFrom[0].requestData
        );
        JSON.parse(decryptedStr).should.be.deep.equal(bobsFields);
    });

    it('create response data', async () => {
        const id: string = await requestManager.createRequest(keyPairHelperBob.getPublicKey(), bobsFields);

        await requestManager.responseToRequest(parseInt(id), keyPairHelperAlisa.getPublicKey(), alisaFields);
        const requestsByFrom = await requestManager.getRequests(
            keyPairHelperAlisa.getPublicKey(),
            null,
            DataRequestState.ACCEPT
        );
        const requestsByTo = await requestManager.getRequests(
            null,
            keyPairHelperBob.getPublicKey(),
            DataRequestState.ACCEPT
        );

        requestsByFrom.should.be.deep.equal(requestsByTo);

        requestsByFrom[0].responseData.should.be.not.equal(alisaFields);
        const decryptedObj: any = await requestManager.decryptMessage(
            keyPairHelperBob.getPublicKey(),
            requestsByFrom[0].responseData
        );

        const resultMap: Map<string, string> = JsonUtils.jsonToMap(decryptedObj);

        alisaFields.length.should.be.equal(resultMap.size);

        resultMap.forEach((value, key) => {
            alisaFields.should.be.contain.deep(key);
        });

    });

    it('grant access for data client', async () => {
        await requestManager.grantAccessForClient(keyPairHelperAlisa.getPublicKey(), bobsFields);
        const requestsByFrom = await requestManager.getRequests(
            keyPairHelperAlisa.getPublicKey(),
            null,
            DataRequestState.ACCEPT
        );
        const requestsByTo = await requestManager.getRequests(
            null,
            keyPairHelperBob.getPublicKey(),
            DataRequestState.ACCEPT
        );

        requestsByFrom.should.be.deep.equal(requestsByTo);

        requestsByFrom[0].responseData.should.be.not.equal(bobsFields);
        const decryptedStr = await keyPairHelperAlisa.decryptMessage(
            keyPairHelperBob.getPublicKey(),
            requestsByFrom[0].responseData
        );
        const resultMap: Map<string, string> = JsonUtils.jsonToMap(JSON.parse(decryptedStr));

        bobsFields.length.should.be.equal(resultMap.size);

        resultMap.forEach((value, key) => {
            bobsFields.should.be.contain.deep(key);
        });

    });

    it('share data for offer', async () => {
        await requestManager.grantAccessForOffer(1, keyPairHelperAlisa.getPublicKey(), bobsFields);
    });

    it('decrypt invalid message', async () => {
        const message: string = 'invalid string';
        const result: any = await requestManager.decryptMessage(
            keyPairHelperAlisa.getPublicKey(),
            message
        );
        assert.ok(result === message, 'WTF?');
    });

});
