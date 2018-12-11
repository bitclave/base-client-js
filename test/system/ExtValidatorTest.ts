import Base from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { CryptoUtils } from '../../src/utils/CryptoUtils';
import DataRequest from '../../src/repository/models/DataRequest';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import { WealthPtr, WealthRecord } from '../../src/utils/types/BaseTypes';
import AuthenticatorHelper from '../AuthenticatorHelper';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';
import { WalletManager } from '../../src/manager/WalletManager';
import { WalletUtils, WalletVerificationStatus } from '../../src/utils/WalletUtils';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { WalletManagerImpl } from '../../src/manager/WalletManagerImpl';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();
const someSigMessage = 'some unique message for signature';
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

describe('BASE API test: External Validator', async () => {
    const passPhraseAlisa: string = 'Alice';
    const passPhraseBob: string = 'Bobik';  // need 5 symbols
    const passPhraseCarol: string = 'Carol';
    const passPhraseDesearch: string = 'Desearch';
    const passPhraseValidator: string = 'Validator';

    const baseAlice: Base = createBase();
    const baseBob: Base = createBase();
    const baseCarol: Base = createBase();
    const baseDesearch: Base = createBase();
    const baseValidator: Base = createBase();

    var accAlice: Account;
    var accBob: Account;
    var accCarol: Account;
    var accDesearch: Account;
    var accValidator: Account;

    function createBase(): Base {
        return new Base(
            // 'http://localhost:8080',
            'https://base2-bitclva-com.herokuapp.com',
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );
    }

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
        accAlice.publicKey.should.be.equal('03cb46e31c2d0f5827bb267f9fb30cf98077165d0e560b964651c6c379f69c7a35');
        accBob.publicKey.should.be.equal('0340a73ea75b60ca5df6b2d6bb53a30f14322f0656ff962d4c6d9097d19d097180');
        accCarol.publicKey.should.be.equal('0384b1a0bf78a291c615b87f924e6b684099efa3e96ecfdb2244d9573f56b849fe');
        accDesearch.publicKey.should.be.equal('02671d71867d52b142f568ccd537a60d6e5fcece2b606e65e016c26c45f3bd8ad8');
        accValidator.publicKey.should.be.equal('03aaac4cdf86121b6a051e67581e30a046c66a4c08097878ce7ab1f3be318dcd74');
    });

    /**/
    it('Alice grants access to validator', async () => {
        // NOTE: Grant is modeled, like if Validator asked for access and Alice granted - so in the repository
        // Validator is "from" and "Alice" is "to", even if Alice initiated the transaction (and she can be considered
        // as "from")

        // create wallets for Alice
        await baseAlice.profileManager.updateData(
            new Map([[WalletManagerImpl.DATA_KEY_ETH_WALLETS, 'test eth wallets']])
        );

        const grantFields: Map<string, AccessRight> = new Map();
        grantFields.set(WalletManagerImpl.DATA_KEY_ETH_WALLETS, AccessRight.R);

        await baseAlice.dataRequestManager.grantAccessForClient(
            accValidator.publicKey, grantFields
        );

        // Validator retrieves the approval
        const requestsByFrom = await baseValidator.dataRequestManager.getRequests(
            accValidator.publicKey, ''
        );

        // Validator decodes Alice's wallets
        const decryptedObj = await baseValidator.profileManager.getAuthorizedData(
            // accAlice.publicKey,
            requestsByFrom[0].toPk,
            requestsByFrom[0].responseData
        );

        // console.log(decryptedObj);
        decryptedObj.get(WalletManagerImpl.DATA_KEY_ETH_WALLETS).should.be.equal('test eth wallets');
    });

    it('Validator asks Alice for access', async () => {
        // create wallets for Alice
        await baseAlice.profileManager.updateData(
            new Map([[WalletManagerImpl.DATA_KEY_ETH_WALLETS, 'test eth wallets']]));

        // Validator asks Alice to get access to eth_wallets
        const id: number = await baseValidator.dataRequestManager.requestPermissions(
            accAlice.publicKey,
            [WalletManagerImpl.DATA_KEY_ETH_WALLETS]
        );

        const grantFields: Map<string, AccessRight> = new Map();
        grantFields.set(WalletManagerImpl.DATA_KEY_ETH_WALLETS, AccessRight.R);

        // Alice grants access to Validator
        await baseAlice.dataRequestManager.grantAccessForClient(
            accValidator.publicKey, grantFields
        );

        // Validator retrieves the approval
        const requestsByFrom = await baseValidator.dataRequestManager.getRequests(
            accValidator.publicKey, ''
        );

        // Validator decodes Alice's wallets
        const decryptedObj = await baseValidator.profileManager.getAuthorizedData(
            // accAlice.publicKey,
            requestsByFrom[0].toPk,
            requestsByFrom[0].responseData
        );

        // console.log(decryptedObj);
        decryptedObj.get(WalletManagerImpl.DATA_KEY_ETH_WALLETS).should.be.equal('test eth wallets');
    });

    /**/
    it('Alice responds to refreshWealthPtr in all initialziatrion stages', async () => {
        // API call before Alice registered with Validator
        await refreshWealthPtrWithCheckError();

        // ~API call before Alice registered with Validator

        await baseAlice.walletManager.addWealthValidator(accValidator.publicKey);
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

        const grantFields: Map<string, AccessRight> = new Map();
        grantFields.set(accAlice.publicKey, AccessRight.R);

        // validator shares results with Alice
        await baseValidator.dataRequestManager.grantAccessForClient(accAlice.publicKey, grantFields);
        // Alice tries to access wealth after it is shared
        const ethWealthPtr1: WealthPtr = await refreshWealthPtrWithCheckError();
        ethWealthPtr1.validator.should.be.equal(accValidator.publicKey);
        // ~Alice tries to access wealth after it is shared

        // Alice tries to access wealth after it is already internally saved
        const ethWealthPtr2: WealthPtr = await refreshWealthPtrWithCheckError();
        ethWealthPtr2.validator.should.be.equal(accValidator.publicKey);
        // ~Alice tries to access wealth after it is already internally saved
    });

    async function refreshWealthPtrWithCheckError(): Promise<WealthPtr> {
        try {
            return await baseAlice.walletManager.refreshWealthPtr();
        } catch (e) {
            if (e === 'validator did not verify anything yet' ||
                e === WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR + ' data not exist!') {
                // ignore error is normal
            } else {
                throw e;
            }
        }
    }

    it('full flow with Alice, Bob, Carol, Desearch and Validator', async () => {
        // to get this records, I used example application, created a wallet records and did copy&paste
        try {
            var wallets = [
                // tslint:disable-next-line:max-line-length
                '{"data":[{"data":"{\\"baseID\\":\\"03cb46e31c2d0f5827bb267f9fb30cf98077165d0e560b964651c6c379f69c7a35\\",\\"ethAddr\\":\\"0x916e1c7340f3f0a7af1a5b55e0fd9c3846ef8d28\\"}","sig":"0x08602606d842363d58e714e18f8c4d4b644c0cdc88d644dba03d0af3558f0691334a4db534034ba736347a085f28a58c9b643be25a9c7169f073f69a26b432531b"}],"sig":"IMBBXn+LLf4jWmjhQ1cWGmccuCZW9M5TwQYq46nXpCFUbs72Sxjn0hxOtmyNwiP4va97ZwCruqFyNhi3CuR1BvM="}',
                // tslint:disable-next-line:max-line-length
                '{"data":[{"data":"{\\"baseID\\":\\"0340a73ea75b60ca5df6b2d6bb53a30f14322f0656ff962d4c6d9097d19d097180\\",\\"ethAddr\\":\\"0x1bb83f8d7f129a1960a7dac980502f64f9ed3fe4\\"}","sig":"0x7e92cb41c0acd2a16a216aa3d0a3c35b349585bf3ff78c961f208be273940ed70bf2d106004f3f66d7311f65fb6444b2013f8c24b343b08b5f5f3318d7a7bb701c"}],"sig":"H4f4nchY7l37PtURD6kjDftT6w2Njn0luhUm1Y4aPxf6YtOhSDe7lxRy5PYCxV6dGC33MVeNp9/jOUyqoZTV6N8="}',
                // tslint:disable-next-line:max-line-length
                '{"data":[{"data":"{\\"baseID\\":\\"0384b1a0bf78a291c615b87f924e6b684099efa3e96ecfdb2244d9573f56b849fe\\",\\"ethAddr\\":\\"0x39c35615912afc979a32c019431cde09415f8bbe\\"}","sig":"0x9e42c1d5cd721bde0132105ef57a835abd915c069f6ca5e5e982c5670d50ac32592ae54dbf46613a28ab7032d73dc40e2b071bbde48deb486e0c0ed18da01ba91b"}],"sig":"ICtfx7h7j5Lpwu5DvtjUcr2Sq0DXLC9uQ9oEPKmCh9CkUokyoOpbmvIDEzwUzdHCIxewXz5A8Y2y+ObxQteaxso="}'
            ];
            var accs = [
                accAlice, accBob, accCarol
            ];

            // create wallets for Alice and grantt access for Validator
            await baseAlice.profileManager.updateData(new Map([[WalletManagerImpl.DATA_KEY_ETH_WALLETS, wallets[0]]]));
            await baseAlice.walletManager.addWealthValidator(accValidator.publicKey);

            // create wallets for Bob and grantt access for Validator
            await baseBob.profileManager.updateData(new Map([[WalletManagerImpl.DATA_KEY_ETH_WALLETS, wallets[1]]]));
            await baseBob.walletManager.addWealthValidator(accValidator.publicKey);

            // create wallets for Carol and grantt access for Validator
            await baseCarol.profileManager.updateData(new Map([[WalletManagerImpl.DATA_KEY_ETH_WALLETS, wallets[2]]]));
            await baseCarol.walletManager.addWealthValidator(accValidator.publicKey);

            // Validator retrieves the requests from Alice,Bob and Carol
            const requestsByFrom: Array<DataRequest> = await baseValidator.dataRequestManager.getRequests(
                accValidator.publicKey, ''
            );

            requestsByFrom.sort((a, b) => a.id > b.id ? 1 : -1);

            // Validator decodes wallets for Alice, Bob and Carol
            const wealthMap: Map<string, string> = new Map<string, string>();
            for (let i = 0; i < requestsByFrom.length; i++) {
                const decryptedObj: Map<string, string> = await baseValidator.profileManager.getAuthorizedData(
                    // accs[i].publicKey,
                    requestsByFrom[i].toPk,
                    requestsByFrom[i].responseData
                );
                decryptedObj.get(WalletManagerImpl.DATA_KEY_ETH_WALLETS).should.be.equal(wallets[i]);

                // validator verifies the ETH wallets
                var res: WalletVerificationStatus = WalletUtils.validateWallets(
                    WalletManagerImpl.DATA_KEY_ETH_WALLETS,
                    JSON.parse(wallets[i]),
                    accs[i].publicKey
                );
                JSON.stringify(res).should.be.equal(JSON.stringify({rc: 0, err: '', details: [0]}));

                // Here we simulate that Validator compute wealth for each requestor
                var wealth = i.toString();
                // ~compute wealth

                // Validator adds all wealth values to map
                const obj = {'sig': await baseValidator.profileManager.signMessage(wealth)};
                obj[WalletManagerImpl.DATA_KEY_WEALTH] = wealth;

                wealthMap.set(accs[i].publicKey, JSON.stringify(obj));
            }

            // Validator writes wealth for all users to BASE
            // Validator stores the data in <key, value> map,
            // where key is the public key of the user that asked for verification
            baseValidator.profileManager.updateData(wealthMap);

            const grantFields: Map<string, AccessRight> = new Map();
            // Validator shares wealth records with the original owners of the wallets
            for (let i = 0; i < requestsByFrom.length; i++) {
                grantFields.clear();
                grantFields.set(accs[i].publicKey, AccessRight.R);

                await baseValidator.dataRequestManager.grantAccessForClient(accs[i].publicKey, grantFields);
            }

            // Alice updates her internal wealth ptr record
            await baseAlice.walletManager.refreshWealthPtr();

            // Alice shares the data with desearch
            // await baseAlice.dataRequestManager.grantAccessForClient(accDesearch.publicKey, ['wealth']);
            // !Alice shares the data with desearch

            // Desearch asks Alice for access
            /* const id: number = */
            await baseDesearch.dataRequestManager.requestPermissions(accAlice.publicKey, [WalletManagerImpl.DATA_KEY_WEALTH]);

            // Alice checks for outstanding requests to her from Desearch
            const recordsForAliceToApprove: Array<DataRequest> = await baseAlice.dataRequestManager.getRequests(
                accDesearch.publicKey, accAlice.publicKey
            );

            recordsForAliceToApprove.length.should.be.equal(1);

            grantFields.clear();
            grantFields.set(WalletManagerImpl.DATA_KEY_WEALTH, AccessRight.R);
            // Alice approves the request
            await baseAlice.dataRequestManager.grantAccessForClient(/* id */
                accDesearch.publicKey, grantFields);

            // Desearch reads wealth record from Alice
            const recordsForDesearch = await baseDesearch.dataRequestManager.getRequests(
                accDesearch.publicKey, accAlice.publicKey
            );
            const wealthOfAlice: Map<string, string> = await baseDesearch.profileManager.getAuthorizedData(
                // accAlice.publicKey, recordsForDesearch[0].responseData);
                recordsForDesearch[0].toPk, recordsForDesearch[0].responseData);
            const wealthRecord = wealthOfAlice.get(WalletManagerImpl.DATA_KEY_WEALTH);
            const wealthRecordObject: WealthPtr = JSON.parse(wealthRecord);
            // console.log(wealthRecord);

            // desearch reads Alice's wealth from Validator's storage
            const rawData = await baseDesearch.profileManager.getRawData(wealthRecordObject.validator);
            var encryptedAliceWealth = rawData.get(accAlice.publicKey);
            // desearch decodes Alice's wealth
            const decryptedAliceWealth: string = CryptoUtils.decryptAes256(encryptedAliceWealth, wealthRecordObject.decryptKey);
            // console.log("Alice's wealth as is seen by Desearch", decryptedAliceWealth);

            const decryptedAliceWealthObject: WealthRecord = JSON.parse(decryptedAliceWealth);

            // desearch verifies the signature of the wealth record
            const Message = require('bitcore-message');
            const bitcore = require('bitcore-lib');
            const addrValidator = bitcore.Address(bitcore.PublicKey(wealthRecordObject.validator));
            Message(decryptedAliceWealthObject.wealth).verify(addrValidator, decryptedAliceWealthObject.sig).should.be.equal(true);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

});
