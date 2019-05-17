import * as assert from 'assert';
import { BehaviorSubject } from 'rxjs/Rx';
import { DataRequestManager } from '../../src/manager/DataRequestManager';
import { DataRequestManagerImpl } from '../../src/manager/DataRequestManagerImpl';
import { ProfileManager } from '../../src/manager/ProfileManager';
import { ProfileManagerImpl } from '../../src/manager/ProfileManagerImpl';
import Account from '../../src/repository/models/Account';
import { HttpTransportImpl } from '../../src/repository/source/http/HttpTransportImpl';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { RpcTransportImpl } from '../../src/repository/source/rpc/RpcTransportImpl';
import { KeyPairFactory } from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { RemoteKeyPairHelper } from '../../src/utils/keypair/RemoteKeyPairHelper';
import AuthenticatorHelper from '../AuthenticatorHelper';
import ClientDataRepositoryImplMock from '../profile/ClientDataRepositoryImplMock';
import DataRequestRepositoryImplMock from './DataRequestRepositoryImplMock';

const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';

require('chai')
    .use(require('chai-as-promised'))
    .should();
const dataRepository: DataRequestRepositoryImplMock = new DataRequestRepositoryImplMock();
const clientRepository = new ClientDataRepositoryImplMock();
const rpcTransport: RpcTransport = new RpcTransportImpl(new HttpTransportImpl(rpcSignerHost));

class SimpleUser {
    public readonly requestManager: DataRequestManager;
    public readonly profileManager: ProfileManager;
    public readonly keyPair: KeyPairHelper;

    constructor(requestManager: DataRequestManager, profileManager: ProfileManager, keyPair: KeyPairHelper) {
        this.requestManager = requestManager;
        this.profileManager = profileManager;
        this.keyPair = keyPair;
    }
}

async function createDataRequestManager(passPhrase: string): Promise<SimpleUser> {
    const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);
    const keyPairHelper: RemoteKeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const accessToken = await authenticatorHelper.generateAccessToken(passPhrase);

    keyPairHelper.setAccessToken(accessToken);
    await keyPairHelper.createKeyPair(passPhrase);
    const account: Account = new Account(keyPairHelper.getPublicKey());
    const authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(account);

    return new SimpleUser(
        new DataRequestManagerImpl(
            dataRepository,
            authAccountBehavior,
            keyPairHelper,
            keyPairHelper
        ),
        new ProfileManagerImpl(
            clientRepository,
            authAccountBehavior,
            keyPairHelper,
            keyPairHelper,
            keyPairHelper
        ),

        keyPairHelper
    );
}

describe('Data Request Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';
    const passPhraseCabe: string = 'I\'m Cabe. This is my secret password';
    const passPhraseDaniel: string = 'I\'m Daniel. This is my secret password';

    const bobsFields = ['name', 'email'];

    let dataAlisa: SimpleUser;
    let dataBob: SimpleUser;
    let dataCabe: SimpleUser;
    let dataDaniel: SimpleUser;

    before(async () => {
        dataAlisa = await createDataRequestManager(passPhraseAlisa);
        dataBob = await createDataRequestManager(passPhraseBob);
        dataCabe = await createDataRequestManager(passPhraseCabe);
        dataDaniel = await createDataRequestManager(passPhraseDaniel);

        dataRepository.setPK(dataAlisa.keyPair.getPublicKey());
    });

    beforeEach((done) => {
        dataRepository.clearData();
        done();
    });

    after(async () => {
        rpcTransport.disconnect();
    });

    it('request for permissions data', async () => {
        await dataAlisa.requestManager.requestPermissions(dataBob.keyPair.getPublicKey(), bobsFields);

        const requestsByFrom = await dataAlisa.requestManager.getRequests(dataAlisa.keyPair.getPublicKey(), null);
        const requestsByTo = await dataAlisa.requestManager.getRequests(null, dataBob.keyPair.getPublicKey());

        requestsByFrom.should.be.deep.equal(requestsByTo);

        requestsByFrom[0].requestData.should.be.not.equal(bobsFields);

        const requestedBobFromAlisa: Array<string> = await dataBob.requestManager.getRequestedPermissions(
            dataAlisa.keyPair.getPublicKey()
        );

        requestedBobFromAlisa.length.should.be.equal(0);

        const requestedAlisaFromBob: Array<string> = await dataBob.requestManager
            .getRequestedPermissionsToMe(dataAlisa.keyPair.getPublicKey());

        requestedAlisaFromBob.length.should.be.equal(bobsFields.length);

        const requestedFromBob: Array<string> = await dataAlisa.requestManager
            .getRequestedPermissions(dataBob.keyPair.getPublicKey());

        requestedFromBob.should.be.deep.equal(bobsFields);
    });

    it('create response data', async () => {
        await dataAlisa.requestManager.requestPermissions(dataBob.keyPair.getPublicKey(), bobsFields);

        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        await dataBob.requestManager.grantAccessForClient(dataAlisa.keyPair.getPublicKey(), grantFields);

        const grantFromAlisaToBob: Array<string> = await dataBob.requestManager
            .getGrantedPermissions(dataAlisa.keyPair.getPublicKey());

        grantFromAlisaToBob.length.should.be.equal(0);

        const requests = await dataAlisa.requestManager
            .getRequests(dataAlisa.keyPair.getPublicKey(), dataBob.keyPair.getPublicKey());

        const grantFromBobToAlisa: Map<string, string | undefined> = (await dataAlisa.profileManager
            .getAuthorizedData(requests))
            .getKeyValue(dataBob.keyPair.getPublicKey());

        const granted: Array<string> = [];

        grantFromBobToAlisa.forEach((value, key) => {
            if (value) {
                granted.push(key);
            }
        });

        granted.should.be.deep.equal(bobsFields);
    });

    it('grand access to field without requested permissions', async () => {
        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        await dataBob.requestManager.grantAccessForClient(dataAlisa.keyPair.getPublicKey(), grantFields);

        const grantFromAlisaToBob: Array<string> = await dataBob.requestManager
            .getGrantedPermissions(dataAlisa.keyPair.getPublicKey());

        grantFromAlisaToBob.length.should.be.equal(0);

        const requests = await dataAlisa.requestManager
            .getRequests(dataAlisa.keyPair.getPublicKey(), dataBob.keyPair.getPublicKey());

        const grantFromBobToAlisa: Map<string, string | undefined> = (await dataAlisa.profileManager
            .getAuthorizedData(requests))
            .getKeyValue(dataBob.keyPair.getPublicKey());

        const granted: Array<string> = [];

        grantFromBobToAlisa.forEach((value, key) => {
            if (value) {
                granted.push(key);
            }
        });

        granted.should.be.deep.equal(bobsFields);
    });

    it('grand access for client and re-share data', async () => {
        // A - save own data
        await dataBob.profileManager.updateData(
            new Map([[bobsFields[0], 'zero index field'], [bobsFields[1], 'one index field']])
        );

        // B make request for A of data
        await dataAlisa.requestManager.requestPermissions(dataBob.keyPair.getPublicKey(), bobsFields);

        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        // A grant access for B
        await dataBob.requestManager
            .grantAccessForClient(dataAlisa.keyPair.getPublicKey(), grantFields);

        const requests = await dataAlisa.requestManager
            .getRequests(dataAlisa.keyPair.getPublicKey(), dataBob.keyPair.getPublicKey());

        const grantFromBobToAlisa: Map<string, string | undefined> = (await dataAlisa.profileManager
            .getAuthorizedData(requests))
            .getKeyValue(dataBob.keyPair.getPublicKey());

        const granted: Array<string> = [];

        grantFromBobToAlisa.forEach((value, key) => {
            if (value) {
                granted.push(key);
            }
        });

        granted.should.be.deep.equal(bobsFields);

        const reshareFiled = new Map<string, AccessRight>([[bobsFields[0], AccessRight.R]]);

        // B re-share data from A to C
        // Bob [name, email] -> Alisa-Bob[name]
        await dataAlisa.requestManager.grantAccessForClient(
            dataCabe.keyPair.getPublicKey(),
            reshareFiled,
            dataBob.keyPair.getPublicKey()
        );

        const grantFromAlisaToCabe: Array<string> = await dataCabe.requestManager
            .getGrantedPermissions(dataAlisa.keyPair.getPublicKey());

        grantFromAlisaToCabe.should.be.deep.equal([bobsFields[0]]);

        // C re-share data to D from B (where root A)
        // Bob [name, email] -> Alisa-Bob[name] -> Cabe-Alisa-Bob[name] -> Daniel
        await dataCabe.requestManager.grantAccessForClient(
            dataDaniel.keyPair.getPublicKey(),
            reshareFiled,
            dataBob.keyPair.getPublicKey()
        );

        const grantFromCabeToDaniel: Array<string> = await dataDaniel.requestManager
            .getGrantedPermissions(dataCabe.keyPair.getPublicKey());

        grantFromCabeToDaniel.should.be.deep.equal([bobsFields[0]]);

        let reShareRequests = await dataCabe.requestManager.getRequests(
            dataCabe.keyPair.getPublicKey(),
            dataAlisa.keyPair.getPublicKey()
        );

        let reSharedFields =
            (await dataCabe.profileManager.getAuthorizedData(reShareRequests))
                .getKeyValue(dataAlisa.keyPair.getPublicKey(), dataBob.keyPair.getPublicKey());

        (reSharedFields.get(bobsFields[0]) as string).should.be.eq('zero index field');

        reShareRequests = await dataDaniel.requestManager.getRequests(
            dataDaniel.keyPair.getPublicKey(),
            dataCabe.keyPair.getPublicKey()
        );

        reSharedFields = (await dataDaniel.profileManager.getAuthorizedData(reShareRequests))
            .getKeyValue(dataCabe.keyPair.getPublicKey(), dataBob.keyPair.getPublicKey());

        (reSharedFields.get(bobsFields[0]) as string).should.be.eq('zero index field');
    });

    it('grand access for client and re-share data and revoke', async () => {
        // A - save own data
        await dataBob.profileManager.updateData(
            new Map([[bobsFields[0], 'zero index field'], [bobsFields[1], 'one index field']])
        );

        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        // A grant all fileds access for B
        await dataBob.requestManager
            .grantAccessForClient(dataAlisa.keyPair.getPublicKey(), grantFields);

        // A grant field by index 1 access for D
        await dataBob.requestManager
            .grantAccessForClient(dataDaniel.keyPair.getPublicKey(), new Map([[bobsFields[1], AccessRight.R]]));

        const reshareFiled = new Map<string, AccessRight>([[bobsFields[0], AccessRight.R]]);

        // B re-share data from A to C
        // Bob [name, email] -> Alisa-Bob[name]
        await dataAlisa.requestManager.grantAccessForClient(
            dataCabe.keyPair.getPublicKey(),
            reshareFiled,
            dataBob.keyPair.getPublicKey()
        );

        // C re-share data to D from B (where root A)
        // Bob [name, email] -> Alisa-Bob[name] -> Cabe-Alisa-Bob[name] -> Daniel
        await dataCabe.requestManager.grantAccessForClient(
            dataDaniel.keyPair.getPublicKey(),
            reshareFiled,
            dataBob.keyPair.getPublicKey()
        );

        (await dataAlisa.requestManager
            .getGrantedPermissions(dataBob.keyPair.getPublicKey())).should.be.deep.equal(bobsFields);

        (await dataCabe.requestManager
            .getGrantedPermissions(dataAlisa.keyPair.getPublicKey())).should.be.deep.equal([bobsFields[0]]);

        (await dataDaniel.requestManager
            .getGrantedPermissions(dataCabe.keyPair.getPublicKey())).should.be.deep.equal([bobsFields[0]]);

        (await dataDaniel.requestManager
            .getGrantedPermissions(dataBob.keyPair.getPublicKey())).should.be.deep.equal([bobsFields[1]]);

        // revoke
        await dataBob.requestManager.revokeAccessForClient(dataAlisa.keyPair.getPublicKey(), bobsFields);

        (await dataAlisa.requestManager
            .getGrantedPermissions(dataBob.keyPair.getPublicKey())).should.be.deep.equal([]);

        (await dataCabe.requestManager
            .getGrantedPermissions(dataAlisa.keyPair.getPublicKey())).should.be.deep.equal([]);

        (await dataDaniel.requestManager
            .getGrantedPermissions(dataCabe.keyPair.getPublicKey())).should.be.deep.equal([]);

        (await dataDaniel.requestManager
            .getGrantedPermissions(dataBob.keyPair.getPublicKey())).should.be.deep.equal([bobsFields[1]]);
    });

    it('grand access to field without requested permissions and revoke access', async () => {
        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        await dataBob.requestManager.grantAccessForClient(dataAlisa.keyPair.getPublicKey(), grantFields);

        const grantFromAlisaToBob: Array<string> = await dataBob.requestManager
            .getGrantedPermissions(dataAlisa.keyPair.getPublicKey());

        grantFromAlisaToBob.length.should.be.equal(0);

        let requests = await dataAlisa.requestManager
            .getRequests(dataAlisa.keyPair.getPublicKey(), dataBob.keyPair.getPublicKey());

        let grantFromBobToAlisa: Map<string, string | undefined> = (await dataAlisa.profileManager
            .getAuthorizedData(requests))
            .getKeyValue(dataBob.keyPair.getPublicKey());

        const granted: Array<string> = [];

        grantFromBobToAlisa.forEach((value, key) => {
            if (value) {
                granted.push(key);
            }
        });

        granted.should.be.deep.equal(bobsFields);

        await dataBob.requestManager.revokeAccessForClient(dataAlisa.keyPair.getPublicKey(), bobsFields);

        requests = await dataAlisa.requestManager
            .getRequests(dataAlisa.keyPair.getPublicKey(), dataBob.keyPair.getPublicKey());

        grantFromBobToAlisa = (await dataAlisa.profileManager
            .getAuthorizedData(requests))
            .getKeyValue(dataBob.keyPair.getPublicKey());

        grantFromBobToAlisa.size.should.be.equal(0);
    });

    it('should be Alisa not nothing found from some pk', async () => {
        const somePK = '020b6936ce0264852b713cff3d03faef1994477924ea0ad4c28a0d2543a16d70ec';

        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }
        await dataBob.requestManager.grantAccessForClient(somePK, grantFields);

        let grant: Array<string> = await dataAlisa.requestManager
            .getGrantedPermissionsToMe(dataBob.keyPair.getPublicKey());

        grant.length.should.be.eq(0);

        grant = await dataAlisa.requestManager
            .getGrantedPermissions(dataBob.keyPair.getPublicKey());

        grant.length.should.be.eq(0);

        let requests: Array<string> = await dataAlisa.requestManager
            .getRequestedPermissions(dataBob.keyPair.getPublicKey());

        requests.length.should.be.eq(0);

        requests = await dataAlisa.requestManager
            .getRequestedPermissionsToMe(dataBob.keyPair.getPublicKey());

        requests.length.should.be.eq(0);
    });

    it('share data for offer', async () => {
        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }
        await dataAlisa.requestManager.grantAccessForOffer(1, dataAlisa.keyPair.getPublicKey(), grantFields, 0);
    });

    it('decrypt invalid message', async () => {
        const message: string = 'invalid string';
        const result = await dataAlisa.requestManager
            .decryptMessage(dataAlisa.keyPair.getPublicKey(), message);

        assert.ok(result === message, 'WTF?');
    });
});
