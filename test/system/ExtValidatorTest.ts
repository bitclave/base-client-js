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
    const baseAlice: Base = new Base(Config.getBaseEndPoint(), Config.getSignerEndPoint());
    const baseValidator: Base = new Base(Config.getBaseEndPoint(), Config.getSignerEndPoint());

    var aliceAccount: Account = new Account();
    var validatorAccount: Account = new Account();

    // baseAlice.profileManager.updateData()

    before(async () => {
        // init Alice
        try {
            aliceAccount = await baseAlice.accountManager.checkAccount(passPhraseAlisa);
        }
        catch(e) {
        }
        if (JSON.stringify(aliceAccount)==JSON.stringify({"publicKey" : ""})) {
            aliceAccount = await baseAlice.accountManager.registration(passPhraseAlisa);
        }
        JSON.stringify(aliceAccount).should.be.equal(
            JSON.stringify({
                "publicKey": "02fe55f705abc712a8a80c43442ebe19ab5e66e5b165a0619440438385bc08383a"
            })
        );

        // init Valdiator
        try {
            validatorAccount = await baseValidator.accountManager.checkAccount(passPhraseValidator);
        }
        catch(e) {
        }
        if (JSON.stringify(validatorAccount)==JSON.stringify({"publicKey" : ""})) {
            validatorAccount = await baseValidator.accountManager.registration(passPhraseValidator);
        }
        JSON.stringify(validatorAccount).should.be.equal(
            JSON.stringify({
                "publicKey": "027b4ac791802620d8896111ed5aba38004e740a296473ead603ae47da34147a81"
            })
        );

    });

    beforeEach(function (done) {
        // clientRepository.clearData();
        done();
    });

    after(async() => {
        // rpcClient.disconnect();
    })

    it('get public ID', async () => {
        aliceAccount.publicKey.should.be.equal('02fe55f705abc712a8a80c43442ebe19ab5e66e5b165a0619440438385bc08383a');
        validatorAccount.publicKey.should.be.equal('027b4ac791802620d8896111ed5aba38004e740a296473ead603ae47da34147a81');
    });

    it('grantt access to validator', async() => {
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
