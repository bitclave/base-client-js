// tslint:disable:no-unused-expression
import Base, { AccessRight } from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { FileMeta } from '../../src/repository/models/FileMeta';
import { BaseClientHelper } from '../BaseClientHelper';

require('chai')
    .use(require('chai-as-promised'))
    .should();
const fs = require('fs');
const Path = require('path');

describe('File CRUD', async () => {
    const newKey: string = 'new_file';
    const updateKey: string = 'update_file';
    const downloadKey: string = 'download_file';
    const passPhraseAlisa: string = 'Alice'; // need 5 symbols
    const passPhraseBob: string = 'BobBob'; // need 5 symbols

    let baseAlice: Base;
    let baseBob: Base;
    let accAlice: Account;
    let accBob: Account;

    beforeEach(async () => {
        baseAlice = await BaseClientHelper.createRegistered(passPhraseAlisa, 'passPhraseAlisa');
        baseBob = await BaseClientHelper.createRegistered(passPhraseBob, 'passPhraseBob');
        accAlice = baseAlice.accountManager.getAccount();
        accBob = baseBob.accountManager.getAccount();
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('get public ID', async () => {
        accAlice.publicKey.should.be.equal('03cb46e31c2d0f5827bb267f9fb30cf98077165d0e560b964651c6c379f69c7a35');
    });

    it('should decrypt foreign data and decrypt file', async () => {
        // Alice save file
        const uploadFileName = Path.join(process.cwd(), './test/asset/test.png');
        const fileToUpload = fs.readFileSync(uploadFileName, {encoding: 'base64'});
        const fileMeta: FileMeta = new FileMeta(0, '0x0', 'test', 'image/png', fileToUpload.length, fileToUpload);
        const fileMetaUploaded: FileMeta = await baseAlice.profileManager.uploadFile(fileMeta, newKey);
        fileMetaUploaded.id.should.exist;

        const savedFileMeta = await baseAlice.profileManager.getFileMetaWithGivenKey(newKey) as FileMeta;

        savedFileMeta.should.be.deep.equal(fileMetaUploaded);

        // Alisa create grand for access to field with FileMeta data
        const grantFields: Map<string, AccessRight> = new Map();
        grantFields.set(newKey, AccessRight.R);

        await baseAlice.dataRequestManager.grantAccessForClient(
            accBob.publicKey,
            grantFields
        );

        // Bob check granted permissions.
        // await baseBob.dataRequestManager.getGrantedPermissions(accAlice.publicKey);

        // Bob get encrypted granted data
        const requests = await baseBob.dataRequestManager.getRequests(accBob.publicKey, accAlice.publicKey);

        // Bob decrypt granted data to Map<filedName, password>
        const keyPassMap = (await baseBob.profileManager.getAuthorizedEncryptionKeys(requests))
            .getKeyValue(accAlice.publicKey);

        const pass = keyPassMap.get(newKey) || '';

        // Bob decrypt granted data
        const decryptedData = (await baseBob.profileManager.getAuthorizedData(requests))
            .getKeyValue(accAlice.publicKey);

        // get file meta as string and convert to Model FileMeta
        const rawFileMeta = decryptedData.get(newKey) || '';
        const decryptedFleMeta = FileMeta.fromJson(JSON.parse(rawFileMeta));

        // download file end decrypt
        const file = await baseBob.profileManager.downloadFile(decryptedFleMeta.id, newKey, accAlice.publicKey, pass);

        file.should.be.eq(fileToUpload);
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
            savedFileMeta.createdAt.getTime().should.be.eq(fileMetaUpdated.createdAt.getTime());
            savedFileMeta.updatedAt.getTime().should.be.lt(fileMetaUpdated.updatedAt.getTime());

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

            const file = await baseAlice.profileManager.downloadFile(fileMetaUploaded.id, downloadKey);

            file.should.exist;
            actualFile.should.be.eq(file);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
