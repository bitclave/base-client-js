import Base from '../../src/Base';
import Config from '../../example/src/Config';
import Account from '../../src/repository/models/Account';
import { DataRequestState } from '../../src/repository/models/DataRequestState';
import CryptoUtils from '../../src/utils/CryptoUtils';
import * as BaseType from '../../src/utils/BaseTypes';
import DataRequest from '../../src/repository/models/DataRequest';
import ProfileManager from '../../src/manager/ProfileManager';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

async function createUser(user: Base, mnemonic: string): Promise<Account> {
    try {
        await user.accountManager.unsubscribe(mnemonic);
    } catch (e) {
        //ignore error if user not exist
    }

    return await user.accountManager.registration(mnemonic);
}

describe('BASE API test: External Validator', async () => {
    const passPhraseAlisa: string = 'Alice';
    const passPhraseBob: string = 'Bobik';  // need 5 symbols
    const passPhraseCarol: string = 'Carol';
    const passPhraseDesearch: string = 'Desearch';
    const passPhraseValidator: string = 'Validator';

    const baseAlice: Base = new Base(Config.getBaseEndPoint());
    const baseBob: Base = new Base(Config.getBaseEndPoint());
    const baseCarol: Base = new Base(Config.getBaseEndPoint());
    const baseDesearch: Base = new Base(Config.getBaseEndPoint());
    const baseValidator: Base = new Base(Config.getBaseEndPoint());

    var accAlice: Account;
    var accBob: Account;
    var accCarol: Account;
    var accDesearch: Account;
    var accValidator: Account;

    before(async () => {

    });

    beforeEach(async () => {
        accAlice = await createUser(baseAlice, passPhraseAlisa);
        accBob = await createUser(baseBob, passPhraseBob);
        accCarol = await createUser(baseCarol, passPhraseCarol);
        accDesearch = await createUser(baseDesearch, passPhraseDesearch);
        accValidator = await createUser(baseValidator, passPhraseValidator);
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('get public ID', async () => {
        accAlice.publicKey.should.be.equal('02fe55f705abc712a8a80c43442ebe19ab5e66e5b165a0619440438385bc08383a');
        accBob.publicKey.should.be.equal('0303247051dc50d32aaacd7b36c96792a8950a0fda1fdf5a41231e67224865f61f');
        accCarol.publicKey.should.be.equal('02de5804b34c2f3b3d917de52c4768984e9200e799df9bd012cfd03fe428d8fafd');
        accDesearch.publicKey.should.be.equal('03d3a075d33cf8b7870d87b0c2e80653f03c00c5966dd27bdc3abab53d928dcc87');
        accValidator.publicKey.should.be.equal('027b4ac791802620d8896111ed5aba38004e740a296473ead603ae47da34147a81');
    });

    /**/
    it('Alice grants access to validator', async () => {
        // NOTE: Grant is modeled, like if Validator asked for access and Alice granted - so in the repository
        // Validator is "from" and "Alice" is "to", even if Alice initiated the transaction (and she can be considered
        // as "from")

        // create wallets for Alice
        await baseAlice.profileManager.updateData(
            new Map([['eth_wallets', 'test eth wallets']]));

        await baseAlice.dataRequestManager.grantAccessForClient(accValidator.publicKey, ['eth_wallets']);

        // Validator retrieves the approval
        const requestsByFrom = await baseValidator.dataRequestManager.getRequests(
            accValidator.publicKey, '', DataRequestState.ACCEPT
        );

        // Validator decodes Alice's wallets
        const decryptedObj: any = await baseValidator.profileManager.getAuthorizedData(
            requestsByFrom[0].toPk,
            requestsByFrom[0].responseData
        );

        // console.log(decryptedObj);
        decryptedObj.get('eth_wallets').should.be.equal('test eth wallets');

    });

    it('Validator asks Alice for access', async () => {
        // create wallets for Alice
        await baseAlice.profileManager.updateData(
            new Map([[ProfileManager.DATA_KEY_ETH_WALLETS, 'test eth wallets']]));

        // Validator asks Alice to get access to eth_wallets
        const id: number = await baseValidator.dataRequestManager.createRequest(
            accAlice.publicKey,
            [ProfileManager.DATA_KEY_ETH_WALLETS]
        );

        // Alice grants access to Validator
        await baseAlice.dataRequestManager.responseToRequest(
            id,
            accValidator.publicKey,
            [ProfileManager.DATA_KEY_ETH_WALLETS]);

        // Validator retrieves the approval
        const requestsByFrom = await baseValidator.dataRequestManager.getRequests(
            accValidator.publicKey, '', DataRequestState.ACCEPT
        );

        // Validator decodes Alice's wallets
        const decryptedObj: any = await baseValidator.profileManager.getAuthorizedData(
            requestsByFrom[0].toPk,
            requestsByFrom[0].responseData
        );

        // console.log(decryptedObj);
        decryptedObj.get(ProfileManager.DATA_KEY_ETH_WALLETS).should.be.equal('test eth wallets');
    });

    /**/
    it('Alice responds to refreshWealthPtr in all initialziatrion stages', async () => {
        // API call before Alice registered with Validator
        await refreshWealthPtrWithCheckError();

        // ~API call before Alice registered with Validator

        await baseAlice.profileManager.addEthWealthValidator(accValidator.publicKey);
        /*
        Assume here Alices registeres with Validator
         */

        // API call before validator computed the wealth and after Alice registered
        await refreshWealthPtrWithCheckError();

        // ~API call before validator computed the wealth

        var wealthMap: Map<string, string> = new Map<string, string>();
        var wealth = Number(18).toString();
        // Validator adds all wealth values to map
        wealthMap.set(accAlice.publicKey, JSON.stringify({
            'wealth': wealth,
            'sig': baseValidator.profileManager.signMessage(wealth)
        }));

        await baseValidator.profileManager.updateData(wealthMap);

        // Alice tries to access wealth before it is shared
        await refreshWealthPtrWithCheckError();
        // ~Alice tries to access wealth before it is shared

        // validator shares results with Alice
        await baseValidator.dataRequestManager.grantAccessForClient(accAlice.publicKey, [accAlice.publicKey]);

        {
            // Alice tries to access wealth after it is shared
            const ethWealthPtr: BaseType.EthWealthPtr = await refreshWealthPtrWithCheckError();
            ethWealthPtr.validator.should.be.equal(accValidator.publicKey);
            // ~Alice tries to access wealth after it is shared
        }

        {
            // Alice tries to access wealth after it is already internally saved
            const ethWealthPtr: BaseType.EthWealthPtr = await refreshWealthPtrWithCheckError();
            ethWealthPtr.validator.should.be.equal(accValidator.publicKey);
            // ~Alice tries to access wealth after it is already internally saved
        }


    });

    private async function refreshWealthPtrWithCheckError(): Promise<BaseType.EthWealthPtr> {
        try {
            return await baseAlice.profileManager.refreshWealthPtr();
        } catch (e) {
            if (e === 'validator did not verify anything yet' ||
                e === ProfileManager.DATA_KEY_ETH_WEALTH_VALIDATOR + ' data not exist!') {
                //ignore error is normal
            } else {
                throw e;
            }
        }
    }

    it('full flow with Alice, Bob, Carol, Desearch and Validator', async () => {

        // to get this records, I used example application, created a wallet records and did copy&paste
        var wallets = [
            '{"data":[{"data":"{\\"baseID\\":\\"02fe55f705abc712a8a80c43442ebe19ab5e66e5b165a0619440438385bc08383a\\",\\"ethAddr\\":\\"0xa5f79860b160dee0943bd1f6a5713a61dc56f931\\"}","sig":"0x5227af80548be15c9d5f5d66fcf8459df7e4203bf4508497133c9e2054a6ed281dfbbc5fdb7f44801fe93da514613efba96efc8e52209c74bb2d1e1769f8ebba1b"}],"sig":"IIBNKCKMHVBq6LpneRJi9ZNia7U5KCHfJq4TotM65xmYSZ7uGH5V2onnvOwK+1/EZQEg6dRzuYgp3PTVRShA4Nc="}',
            '{"data":[{"data":"{\\"baseID\\":\\"0303247051dc50d32aaacd7b36c96792a8950a0fda1fdf5a41231e67224865f61f\\",\\"ethAddr\\":\\"0xa5f79860b160dee0943bd1f6a5713a61dc56f931\\"}","sig":"0x55b61cea89a84722288807553ad35994bdb45813a6273dee35d5b33bc49cfaa879d8b2c5451ec191cdc6974ed3ad7e3050130d4498915134debb2ff977dd83e91c"}],"sig":"INzbg3aOjA4qc+PD9K787CEFUORJGw5iv/09rEZGR3mSdmaWpDe9OfLSLKBTbk9BI6ZCzm/k5To8/Sw4QrjV07k="}',
            '{"data":[{"data":"{\\"baseID\\":\\"02de5804b34c2f3b3d917de52c4768984e9200e799df9bd012cfd03fe428d8fafd\\",\\"ethAddr\\":\\"0xa5f79860b160dee0943bd1f6a5713a61dc56f931\\"}","sig":"0x8ee4014de7b828adeede57f1abfa626d058f52881df4268d67439a11bcbe03f16aaa8e70e7f7f6bff2b7f8bb2714b4b0002e959be73f3f191e42a4b2f04668f31b"}],"sig":"IMmdINnrSQS6VaQOXqr2/BX/LlIFl34stcEOfl6kR9HRJl8BkkNbDWzYm+xI0jA6ZAdKT70TTXO6OX4ST8n2cHo="}'
        ];
        var accs = [
            accAlice, accBob, accCarol
        ];

        // create wallets for Alice and grantt access for Validator
        await baseAlice.profileManager.updateData(new Map([['eth_wallets', wallets[0]]]));
        await baseAlice.profileManager.addEthWealthValidator(accValidator.publicKey);

        // create wallets for Bob and grantt access for Validator
        await baseBob.profileManager.updateData(new Map([['eth_wallets', wallets[1]]]));
        await baseBob.profileManager.addEthWealthValidator(accValidator.publicKey);

        // create wallets for Carol and grantt access for Validator
        await baseCarol.profileManager.updateData(new Map([['eth_wallets', wallets[2]]]));
        await baseCarol.profileManager.addEthWealthValidator(accValidator.publicKey);

        // Validator retrieves the requests from Alice,Bob and Carol
        const requestsByFrom = await baseValidator.dataRequestManager.getRequests(
            accValidator.publicKey, '', DataRequestState.ACCEPT
        );

        // Validator decodes wallets for Alice, Bob and Carol
        var wealthMap: Map<string, string> = new Map<string, string>();
        for (var i = 0; i < requestsByFrom.length; i++) {
            const decryptedObj: any = await baseValidator.profileManager.getAuthorizedData(
                requestsByFrom[i].toPk,
                requestsByFrom[i].responseData
            );
            decryptedObj.get('eth_wallets').should.be.equal(wallets[i]);

            // validator verifies the ETH wallets
            var res = baseValidator.profileManager.validateEthWallets(
                'eth_wallets',
                JSON.parse(wallets[i]),
                accs[i].publicKey
            );
            JSON.stringify(res).should.be.equal(JSON.stringify({rc: 0, err: '', details: [0]}));

            // Here we simulate that Validator compute wealth for each requestor
            var wealth = i.toString();
            // ~compute wealth

            // Validator adds all wealth values to map
            wealthMap.set(accs[i].publicKey, JSON.stringify({
                'wealth': wealth,
                'sig': baseValidator.profileManager.signMessage(wealth)
            }));
        }

        // Validator writes wealth for all users to BASE
        // Validator stores the data in <key, value> map, where key is the public key of the user that asked for verification
        baseValidator.profileManager.updateData(wealthMap);

        // Validator shares wealth records with the original owners of the wallets
        for (var i = 0; i < requestsByFrom.length; i++) {
            await baseValidator.dataRequestManager.grantAccessForClient(accs[i].publicKey, [accs[i].publicKey]);
        }

        // Alice updates her internal wealth ptr record
        await baseAlice.profileManager.refreshWealthPtr();

        //Alice shares the data with desearch
        // await baseAlice.dataRequestManager.grantAccessForClient(accDesearch.publicKey, ['wealth']);
        //!Alice shares the data with desearch

        // Desearch asks Alice for access
        /* const id: number = */
        await baseDesearch.dataRequestManager.createRequest(accAlice.publicKey, ['wealth']);

        // Alice checks for outstanding requests to her from Desearch
        const recordsForAliceToApprove: Array<DataRequest> = await baseAlice.dataRequestManager.getRequests(
            accDesearch.publicKey, accAlice.publicKey, DataRequestState.AWAIT
        );

        recordsForAliceToApprove.length.should.be.equal(1);

        // Alice approves the request
        await baseAlice.dataRequestManager.responseToRequest(/* id */
            recordsForAliceToApprove[0].id, accDesearch.publicKey, ['wealth']);

        //Desearch reads wealth record from Alice
        const recordsForDesearch = await baseDesearch.dataRequestManager.getRequests(
            accDesearch.publicKey, accAlice.publicKey, DataRequestState.ACCEPT
        );
        const wealthOfAlice: Map<string, string> = await baseDesearch.profileManager.getAuthorizedData(
            recordsForDesearch[0].toPk, recordsForDesearch[0].responseData);
        const wealthRecord: any = wealthOfAlice.get('wealth');
        const wealthRecordObject: BaseType.EthWealthPtr = JSON.parse(wealthRecord);
        // console.log(wealthRecord);

        // desearch reads Alice's wealth from Validator's storage
        var encryptedAliceWealth: any = (await baseDesearch.profileManager.getRawData(wealthRecordObject.validator)).get(accAlice.publicKey);
        // desearch decodes Alice's wealth
        const decryptedAliceWealth: string = CryptoUtils.decryptAes256(encryptedAliceWealth, wealthRecordObject.decryptKey);
        // console.log("Alice's wealth as is seen by Desearch", decryptedAliceWealth);

        const decryptedAliceWealthObject: BaseType.EthWealthRecord = JSON.parse(decryptedAliceWealth);

        // desearch verifies the signature of the wealth record
        const Message = require('bitcore-message');
        const bitcore = require('bitcore-lib');
        const addrValidator = bitcore.Address(bitcore.PublicKey(wealthRecordObject.validator));
        Message(decryptedAliceWealthObject.wealth).verify(addrValidator, decryptedAliceWealthObject.sig).should.be.true;
    });

});
