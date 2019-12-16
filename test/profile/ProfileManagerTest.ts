import Base from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { BaseClientHelper } from '../BaseClientHelper';

require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Profile Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';

    let baseAlice: Base;
    let accountAlice: Account;

    before(async () => {
        baseAlice = await BaseClientHelper.createRegistered(passPhraseAlisa);
        accountAlice = baseAlice.accountManager.getAccount();
    });

    it('update data and validate updated data', async () => {
        const origMockData: Map<string, string> = new Map();

        origMockData.set('email', 'im@host.com');

        const data = await baseAlice.profileManager.updateData(origMockData);
        const savedData = await baseAlice.profileManager.getRawData(accountAlice.publicKey);
        const savedDecrypted = await baseAlice.profileManager.getData();

        savedData.should.be.deep.equal(data);
        savedDecrypted.should.be.deep.equal(origMockData);
    });

    it('should be get data by keys', async () => {
        const origMockData: Map<string, string> = new Map();

        origMockData.set('email', 'im@host.com');
        origMockData.set('name', 'isName');
        origMockData.set('last_name', 'isLastName');

        const data = await baseAlice.profileManager.updateData(origMockData);
        const savedData = await baseAlice.profileManager.getRawData(accountAlice.publicKey);
        let savedDecrypted = await baseAlice.profileManager.getData();

        savedData.should.be.deep.equal(data);
        savedDecrypted.size.should.be.equal(3);

        savedDecrypted = await baseAlice.profileManager.getData('name');

        savedDecrypted.size.should.be.equal(1);
        (savedDecrypted.get('name') || '').should.be.eq(origMockData.get('name'));

        savedDecrypted = await baseAlice.profileManager.getData(['name', 'last_name']);

        savedDecrypted.size.should.be.equal(2);
        (savedDecrypted.get('name') || '').should.be.eq(origMockData.get('name'));
        (savedDecrypted.get('last_name') || '').should.be.eq(origMockData.get('last_name'));
    });
});
