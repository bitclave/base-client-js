import Base from '../../src/Base';
import Config from "../../example/src/Config";
import Account from "../../src/repository/models/Account";
import {DataRequestState} from "../../src/repository/models/DataRequestState";
import JsonUtils from "../../src/utils/JsonUtils";


const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('BASE API test: External Validator', async () => {
    const passPhraseAlisa: string = 'Alice';
    const passPhraseValidator: string = 'Validator';
    const baseAlice: Base = new Base(Config.getBaseEndPoint());
    const baseValidator: Base = new Base(Config.getBaseEndPoint());

    var aliceAccount: Account = new Account();
    var validatorAccount: Account = new Account();

    // baseAlice.profileManager.updateData()

    before(async () => {
        // // init Alice
        // try {
        //     aliceAccount = await baseAlice.accountManager.checkAccount(passPhraseAlisa);
        //     await baseAlice.accountManager.unsubscribe(passPhraseAlisa);
        // }
        // catch(e) {
        // }
        //
        // aliceAccount = await baseAlice.accountManager.registration(passPhraseAlisa);
        //
        // JSON.stringify(aliceAccount).should.be.equal(
        //     JSON.stringify({
        //         "publicKey": "02fe55f705abc712a8a80c43442ebe19ab5e66e5b165a0619440438385bc08383a"
        //     })
        // );
        //
        // // init Valdiator
        // try {
        //     validatorAccount = await baseValidator.accountManager.checkAccount(passPhraseValidator);
        //     await baseValidator.accountManager.unsubscribe(passPhraseValidator);
        // }
        // catch(e) {
        // }
        // validatorAccount = await baseValidator.accountManager.registration(passPhraseValidator);
        //
        // JSON.stringify(validatorAccount).should.be.equal(
        //     JSON.stringify({
        //         "publicKey": "027b4ac791802620d8896111ed5aba38004e740a296473ead603ae47da34147a81"
        //     })
        // );

    });

    beforeEach(async() => {
        try { await baseAlice.accountManager.unsubscribe(passPhraseAlisa); } catch (e) {}
        aliceAccount = await baseAlice.accountManager.registration(passPhraseAlisa);
        try { await baseValidator.accountManager.unsubscribe(passPhraseValidator); } catch(e) {}
        validatorAccount = await baseValidator.accountManager.registration(passPhraseValidator);
    });

    after(async() => {
        // rpcClient.disconnect();
    })

    it('get public ID', async () => {
        aliceAccount.publicKey.should.be.equal('02fe55f705abc712a8a80c43442ebe19ab5e66e5b165a0619440438385bc08383a');
        validatorAccount.publicKey.should.be.equal('027b4ac791802620d8896111ed5aba38004e740a296473ead603ae47da34147a81');
    });

    it('grant access to validator', async () => {

        // NOTE: Grant is modeled, like if Validator asked for access and Alice granted - so in the repository
        // Validator is "from" and "Alice" is "to", even if Alice initiated the transaction (and she can be considered
        // as "from")

        // create wallets for Alice
        await baseAlice.profileManager.updateData(
            new Map([['eth_wallets1', 'test eth wallets']]));

        await baseAlice.dataRequestManager.grantAccessForClient(validatorAccount.publicKey, ["eth_wallets1"]);

        // Validator retrieves the approval
        const requestsByFrom = await baseValidator.dataRequestManager.getRequests(
             validatorAccount.publicKey, '', DataRequestState.ACCEPT
        );

        // Validator decodes Alice's wallets
        const decryptedObj: any = await baseValidator.profileManager.getAuthorizedData(
            aliceAccount.publicKey,
            requestsByFrom[0].responseData
        );

        // console.log(decryptedObj);
        decryptedObj.get('eth_wallets1').should.be.equal('test eth wallets');

    });

    it('validator asks for access', async() => {
        // create wallets for Alice
        await baseAlice.profileManager.updateData(
            new Map([['eth_wallets', 'test eth wallets']]));

        // Validator asks Alice to get access to eth_wallets
        const id: number = await baseValidator.dataRequestManager.createRequest(aliceAccount.publicKey, ['eth_wallets']);

        // Alice grants access to Validator
        await baseAlice.dataRequestManager.responseToRequest(id, validatorAccount.publicKey, ['eth_wallets']);

        // Validator retrieves the approval
        const requestsByFrom = await baseValidator.dataRequestManager.getRequests(
            validatorAccount.publicKey, '', DataRequestState.ACCEPT
        );

        // Validator decodes Alice's wallets
        const decryptedObj: any = await baseValidator.profileManager.getAuthorizedData(
            aliceAccount.publicKey,
            requestsByFrom[0].responseData
        );

        // console.log(decryptedObj);
        decryptedObj.get('eth_wallets').should.be.equal('test eth wallets');


    });


});
