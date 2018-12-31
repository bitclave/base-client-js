import Base from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { CryptoUtils } from '../../src/utils/CryptoUtils';
import DataRequest from '../../src/repository/models/DataRequest';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import AuthenticatorHelper from '../AuthenticatorHelper';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import FileMeta from '../../src/repository/models/FileMeta';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();
const fs = require('fs');

const someSigMessage = 'some unique message for signature';
const baseNodeUrl = process.env.BASE_NODE_URL || 'http://localhost:8080';
const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';
const rpcTransport: RpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

async function createUser(user: Base, pass: string): Promise<Account> {
    let accessToken: string = '';
    try {
        accessToken = await authenticatorHelper.generateAccessToken(pass);
        await user.accountManager.authenticationByAccessToken(accessToken, someSigMessage);
        await user.accountManager.unsubscribe();
    } catch (e) {
        console.log('check createUser', e);
        // ignore error if user not exist
    }

    return await user.accountManager.registration(pass, someSigMessage); // this method private.
}

describe('File CRUD', async () => {
    const key: string = 'dl_file';
    const passPhraseAlisa: string = 'Alice'; // need 5 symbols

    const baseAlice: Base = createBase();

    var accAlice: Account;

    function createBase(): Base {
        return new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );
    }

    beforeEach(async () => {
        accAlice = await createUser(baseAlice, passPhraseAlisa);
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('get public ID', async () => {
        accAlice.publicKey.should.be.equal('03cb46e31c2d0f5827bb267f9fb30cf98077165d0e560b964651c6c379f69c7a35');
    });

    it('should upload simple file with key', async () => {
        try {
            const fileToUpload = fs.createReadStream('./test/asset/test.png');
            const fileMetaUploaded: FileMeta = await baseAlice.profileManager.uploadFile(fileToUpload, key);
            fileMetaUploaded.id.should.exist;

            const savedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(key);

            savedFileMeta.should.be.deep.equal(fileMetaUploaded);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should update key\'s existed file', async () => {
        try {
            const fileToUpload = fs.createReadStream('./test/asset/test.png');
            const fileMetaUploaded: FileMeta = await baseAlice.profileManager.uploadFile(fileToUpload, key);
            fileMetaUploaded.id.should.exist;

            const savedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(key);

            savedFileMeta.should.be.deep.equal(fileMetaUploaded);

            const fileToUpdate = fs.createReadStream('./test/asset/test.png');
            const fileMetaUpdated: FileMeta = await baseAlice.profileManager.uploadFile(fileToUpdate, key);
            fileMetaUpdated.id.should.exist;
            fileMetaUpdated.id.should.be.eql(fileMetaUploaded.id);

            const updatedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(key);

            updatedFileMeta.should.be.deep.equal(fileMetaUpdated);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should download existed file', async () => {
        try {
            const fileToUpload = fs.createReadStream('./test/asset/test.png');
            const fileMetaUploaded: FileMeta = await baseAlice.profileManager.uploadFile(fileToUpload, key);
            fileMetaUploaded.id.should.exist;

            const savedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(key);

            savedFileMeta.should.be.deep.equal(fileMetaUploaded);

            const file: Blob = await baseAlice.profileManager.downloadFile(fileMetaUploaded.id);

            file.should.exist;

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

});
