import { KeyPairFactory } from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { DataRequestManager } from '../../src/manager/DataRequestManager';
import DataRequestRepositoryImplMock from './DataRequestRepositoryImplMock';
import { BehaviorSubject } from 'rxjs/Rx';
import Account from '../../src/repository/models/Account';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { RpcTransportImpl } from '../../src/repository/source/rpc/RpcTransportImpl';
import { HttpTransportImpl } from '../../src/repository/source/http/HttpTransportImpl';
import * as assert from 'assert';
import AuthenticatorHelper from '../AuthenticatorHelper';
import { RemoteSigner } from '../../src/utils/keypair/RemoteSigner';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { DataRequestManagerImpl } from '../../src/manager/DataRequestManagerImpl';

const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Data Request Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const rpcTransport: RpcTransport = new RpcTransportImpl(new HttpTransportImpl(rpcSignerHost));
    const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const keyPairHelperBob: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const dataRepository: DataRequestRepositoryImplMock = new DataRequestRepositoryImplMock();

    const bobsFields = ['name', 'email'];
    const alisaFields = ['email'];

    var requestManagerAlisa: DataRequestManager;
    var requestManagerBob: DataRequestManager;

    before(async () => {
        const alisaAccessToken = await authenticatorHelper.generateAccessToken(passPhraseAlisa);
        const bobAccessToken = await authenticatorHelper.generateAccessToken(passPhraseBob);

        (keyPairHelperAlisa as RemoteSigner).setAccessToken(alisaAccessToken);
        (keyPairHelperBob as RemoteSigner).setAccessToken(bobAccessToken);

        await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
        await keyPairHelperBob.createKeyPair(passPhraseBob);

        const accountAlisa: Account = new Account(keyPairHelperAlisa.getPublicKey());
        const authAccountBehaviorAlisa: BehaviorSubject<Account> = new BehaviorSubject<Account>(accountAlisa);

        const accountBob: Account = new Account(keyPairHelperBob.getPublicKey());
        const authAccountBehaviorBob: BehaviorSubject<Account> = new BehaviorSubject<Account>(accountBob);

        dataRepository.setPK(keyPairHelperAlisa.getPublicKey(), keyPairHelperBob.getPublicKey());

        requestManagerAlisa = new DataRequestManagerImpl(
            dataRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );

        requestManagerBob = new DataRequestManagerImpl(
            dataRepository,
            authAccountBehaviorBob,
            keyPairHelperBob,
            keyPairHelperBob
        );
    });

    beforeEach((done) => {
        dataRepository.clearData();
        done();
    });

    after(async () => {
        rpcTransport.disconnect();
    });

    it('request for permissions data', async () => {
        await requestManagerAlisa.requestPermissions(keyPairHelperBob.getPublicKey(), bobsFields);

        const requestsByFrom = await requestManagerAlisa.getRequests(keyPairHelperAlisa.getPublicKey(), null);
        const requestsByTo = await requestManagerAlisa.getRequests(null, keyPairHelperBob.getPublicKey());

        requestsByFrom.should.be.deep.equal(requestsByTo);

        requestsByFrom[0].requestData.should.be.not.equal(bobsFields);

        const requestedBobFromAlisa: Array<string> = await requestManagerBob.getRequestedPermissions(
            keyPairHelperAlisa.getPublicKey()
        );

        requestedBobFromAlisa.length.should.be.equal(0);

        const requestedAlisaFromBob: Array<string> =
            await requestManagerBob.getRequestedPermissionsToMe(keyPairHelperAlisa.getPublicKey());

        requestedAlisaFromBob.length.should.be.equal(bobsFields.length);

        const requestedFromBob: Array<string> = await requestManagerAlisa.getRequestedPermissions(
            keyPairHelperBob.getPublicKey(),
        );

        requestedFromBob.should.be.deep.equal(bobsFields);

        const decryptedStr = await keyPairHelperBob.decryptMessage(
            keyPairHelperAlisa.getPublicKey(),
            requestsByFrom[0].requestData
        );
        JSON.parse(decryptedStr).should.be.deep.equal(bobsFields);
    });

    it('create response data', async () => {
        await requestManagerAlisa.requestPermissions(keyPairHelperBob.getPublicKey(), bobsFields);

        const grantFields: Map<string, AccessRight> = new Map();
        for (let item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        await requestManagerBob.grantAccessForClient(keyPairHelperAlisa.getPublicKey(), grantFields);

        const grantFromAlisaToBob: Array<string> = await requestManagerBob.getGrantedPermissions(
            keyPairHelperAlisa.getPublicKey()
        );

        grantFromAlisaToBob.length.should.be.equal(0);

        const grantFromBobToAlisa: Array<string> = await requestManagerBob.getGrantedPermissionsToMe(
            keyPairHelperAlisa.getPublicKey()
        );

        grantFromBobToAlisa.should.be.deep.equal(bobsFields);
    });

    it('grand access to field without requested permissions', async () => {
        const grantFields: Map<string, AccessRight> = new Map();
        for (let item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        await requestManagerBob.grantAccessForClient(keyPairHelperAlisa.getPublicKey(), grantFields);

        const grantFromAlisaToBob: Array<string> = await requestManagerBob.getGrantedPermissions(
            keyPairHelperAlisa.getPublicKey()
        );

        grantFromAlisaToBob.length.should.be.equal(0);

        const grantFromBobToAlisa: Array<string> = await requestManagerBob.getGrantedPermissionsToMe(
            keyPairHelperAlisa.getPublicKey()
        );

        grantFromBobToAlisa.should.be.deep.equal(bobsFields);
    });

    it('should be Alisa not nothing found from some pk', async () => {
        const somePK = '020b6936ce0264852b713cff3d03faef1994477924ea0ad4c28a0d2543a16d70ec';

        const grantFields: Map<string, AccessRight> = new Map();
        for (let item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }
        await requestManagerBob.grantAccessForClient(somePK, grantFields);

        let grant: Array<string> = await requestManagerAlisa.getGrantedPermissionsToMe(
            keyPairHelperBob.getPublicKey()
        );
        grant.length.should.be.eq(0);

        grant = await requestManagerAlisa.getGrantedPermissions(
            keyPairHelperBob.getPublicKey()
        );
        grant.length.should.be.eq(0);

        let requests: Array<string> = await requestManagerAlisa.getRequestedPermissions(
            keyPairHelperBob.getPublicKey()
        );
        requests.length.should.be.eq(0);

        requests = await requestManagerAlisa.getRequestedPermissionsToMe(
            keyPairHelperBob.getPublicKey()
        );
        requests.length.should.be.eq(0);
    });

    it('share data for offer', async () => {
        const grantFields: Map<string, AccessRight> = new Map();
        for (let item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }
        await requestManagerAlisa.grantAccessForOffer(1, keyPairHelperAlisa.getPublicKey(), grantFields, 0);
    });

    it('decrypt invalid message', async () => {
        const message: string = 'invalid string';
        const result = await requestManagerAlisa.decryptMessage(
            keyPairHelperAlisa.getPublicKey(),
            message
        );
        assert.ok(result === message, 'WTF?');
    });

});
