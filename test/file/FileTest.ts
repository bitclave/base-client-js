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
const Path = require('path');


const someSigMessage = 'some unique message for signature';
const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
const rpcSignerHost = process.env.SIGNER || ''; // use internal SIGNER
const rpcTransport: RpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

async function createUser(user: Base, pass: string): Promise<Account> {
    let accessToken: string = '';
    try {
        await user.accountManager.authenticationByPassPhrase(pass, someSigMessage);
        await user.accountManager.unsubscribe();
    } catch (e) {
        console.log('check createUser', e);
        // ignore error if user not exist
    }

    return await user.accountManager.registration(pass, someSigMessage); // this method private.
}

describe('File CRUD', async () => {
    const new_key: string = 'new_file';
    const update_key: string = 'update_file';
    const download_key: string = 'download_file';
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
            const upldFileName = Path.join(process.cwd(),'./test/asset/test.png');
            const fileToUpload = fs.createReadStream(upldFileName);
            const fileMetaUploaded: FileMeta = await baseAlice.profileManager.uploadFile(fileToUpload, new_key);
            fileMetaUploaded.id.should.exist;

            const savedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(new_key);

            savedFileMeta.should.be.deep.equal(fileMetaUploaded);
            
        } catch (e) {
            console.log(e);
            // throw e;
        }
    });

    it('should update key\'s existed file', async () => {
        try {
            // debugger
            const upldFileName = Path.join(process.cwd(),'./test/asset/test.png');
            const fileToUpload = fs.createReadStream(upldFileName);
            const fileMetaUploaded: FileMeta = await baseAlice.profileManager.uploadFile(fileToUpload, update_key);
            fileMetaUploaded.id.should.exist;

            const savedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(update_key);

            savedFileMeta.should.be.deep.equal(fileMetaUploaded);

            const updateFileName = Path.join(process.cwd(),'./test/asset/test.png');
            const fileToUpdate = fs.createReadStream(updateFileName);
            const fileMetaUpdated: FileMeta = await baseAlice.profileManager.uploadFile(fileToUpdate, update_key);
            fileMetaUpdated.id.should.exist;
            fileMetaUpdated.id.should.be.eql(fileMetaUploaded.id);

            const updatedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(update_key);

            updatedFileMeta.should.be.deep.equal(fileMetaUpdated);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }); 

    it('should download existed file', async () => {
        try {
            const upldFileName = Path.join(process.cwd(),'./test/asset/test.png');
            const fileToUpload = fs.createReadStream(upldFileName);
            const actualFile = fs.readFileSync(upldFileName);
            const fileMetaUploaded: FileMeta = await baseAlice.profileManager.uploadFile(fileToUpload, download_key);
            fileMetaUploaded.id.should.exist;

            const savedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(download_key);

            savedFileMeta.should.be.deep.equal(fileMetaUploaded);

            const file: Buffer = await baseAlice.profileManager.downloadFile(fileMetaUploaded.id);

            file.should.exist;
            actualFile.equals(file);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

});
