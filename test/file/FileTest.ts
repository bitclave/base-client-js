// tslint:disable:no-unused-expression
import Base from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { FileMeta } from '../../src/repository/models/FileMeta';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';

require('chai')
    .use(require('chai-as-promised'))
    .should();
const fs = require('fs');
const Path = require('path');

const someSigMessage = 'some unique message for signature';
const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
const rpcSignerHost = process.env.SIGNER || ''; // use internal SIGNER

async function createUser(user: Base, pass: string): Promise<Account> {
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
    const newKey: string = 'new_file';
    const updateKey: string = 'update_file';
    const downloadKey: string = 'download_file';
    const passPhraseAlisa: string = 'Alice'; // need 5 symbols

    const baseAlice: Base = createBase();

    let accAlice: Account;

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
            const uploadFileName = Path.join(process.cwd(), './test/asset/test.png');
            const fileToUpload = fs.readFileSync(uploadFileName, {encoding: 'base64'});
            const fileMeta: FileMeta = new FileMeta(0, '0x0', 'test', 'image/png', fileToUpload.length, fileToUpload);
            const fileMetaUploaded: FileMeta = await baseAlice.profileManager.uploadFile(fileMeta, newKey);
            fileMetaUploaded.id.should.exist;

            const savedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(newKey) as FileMeta;

            savedFileMeta.should.be.deep.equal(fileMetaUploaded);

        } catch (e) {
            console.log(e);
            // throw e;
        }
    });

    it('should update key\'s existed file', async () => {
        try {
            // debugger
            const uploadFileName = Path.join(process.cwd(), './test/asset/test.png');

            const fileToUpload = fs.readFileSync(uploadFileName, {encoding: 'base64'});
            let fileMeta: FileMeta = new FileMeta(0, '0x0', 'test', 'image/png', fileToUpload.length, fileToUpload);

            const fileMetaUploaded: FileMeta = await baseAlice.profileManager.uploadFile(fileMeta, updateKey);
            fileMetaUploaded.id.should.exist;

            const savedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(updateKey) as FileMeta;

            savedFileMeta.should.be.deep.equal(fileMetaUploaded);

            const updateFileName = Path.join(process.cwd(), './test/asset/test.png');
            const fileToUpdate = fs.readFileSync(updateFileName, {encoding: 'base64'});

            fileMeta = new FileMeta(0, '0x0', 'test', 'image/png', fileToUpdate.length, fileToUpdate);
            const fileMetaUpdated: FileMeta = await baseAlice.profileManager.uploadFile(fileMeta, updateKey);
            fileMetaUpdated.id.should.exist;
            fileMetaUpdated.id.should.be.eql(fileMetaUploaded.id);

            const updatedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(updateKey) as FileMeta;

            updatedFileMeta.should.be.deep.equal(fileMetaUpdated);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should download existed file', async () => {
        try {
            const uploadFileName = Path.join(process.cwd(), './test/asset/test.png');
            const fileToUpload = fs.readFileSync(uploadFileName, {encoding: 'base64'});
            const actualFile = fs.readFileSync(uploadFileName, {encoding: 'base64'});

            const fileMeta: FileMeta = new FileMeta(0, '0x0', 'test', 'image/png', fileToUpload.length, fileToUpload);
            const fileMetaUploaded: FileMeta = await baseAlice.profileManager.uploadFile(fileMeta, downloadKey);
            fileMetaUploaded.id.should.exist;

            const savedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(downloadKey) as FileMeta;

            savedFileMeta.should.be.deep.equal(fileMetaUploaded);

            const file = await baseAlice.profileManager.downloadFile(fileMetaUploaded.id);

            file.should.exist;
            actualFile.should.be.eq(file);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

});
