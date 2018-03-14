import KeyPairFactory from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import DataRequestManager from '../../src/manager/DataRequestManager';
import DataRequestRepositoryImplMock from './DataRequestRepositoryImplMock';
import { DataRequestState } from '../../src/repository/models/DataRequestState';
import JsonUtils from '../../src/utils/JsonUtils';
import { BehaviorSubject } from 'rxjs/Rx';
import Account from '../../src/repository/models/Account';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Data Request Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
    const keyPairHelperBob: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
    const dataRepository: DataRequestRepositoryImplMock = new DataRequestRepositoryImplMock();

    const bobsFields = ['name', 'email'];
    const alisaFields = ['email'];

    keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
    keyPairHelperBob.createKeyPair(passPhraseBob);

    const accountBob: Account = new Account(keyPairHelperBob.getPublicKey());
    const authAccountBehaviorBob: BehaviorSubject<Account> = new BehaviorSubject<Account>(accountBob);

    dataRepository.setPK(keyPairHelperAlisa.getPublicKey(), keyPairHelperBob.getPublicKey());

    const requestManager = new DataRequestManager(
        dataRepository,
        authAccountBehaviorBob,
        keyPairHelperAlisa,
        keyPairHelperAlisa
    );

    beforeEach(function (done) {
        dataRepository.clearData();
        done();
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
        const decryptedStr = keyPairHelperBob.decryptMessage(
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
        const decryptedObj: any = requestManager.decryptMessage(
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
        const decryptedStr = keyPairHelperAlisa.decryptMessage(
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
        await requestManager.grantAccessForOffer(1, keyPairHelperAlisa.getPublicKey(), bobsFields)
    });

});
