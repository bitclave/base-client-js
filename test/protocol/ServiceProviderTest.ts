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
const rpcSignerHost: string = 'http://localhost:3545';
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
        //ignore error if user not exist
    }

    return await user.accountManager.registration(pass, someSigMessage); // this method private.
}

describe('BASE API test: Protocol Flow', async () => {
    const passPhraseUser: string = 'Alice';
    const passPhraseBusiness: string = 'Business';
    const passPhraseValidator: string = 'Validator';

    const baseUser: Base = createBase();
    const baseBusiness: Base = createBase();
    const baseValidator: Base = createBase();

    var accUser: Account;
    var accBusiness: Account;
    var accValidator: Account;

    private function createBase(): Base {
        return new Base(
            'http://localhost:8080',
            //'https://base2-bitclva-com.herokuapp.com',
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );
    }

    before(async () => {

    });

    beforeEach(async () => {
        accUser = await createUser(baseUser, passPhraseUser);
        accBusiness = await createUser(baseBusiness, passPhraseBusiness);
        accValidator = await createUser(baseValidator, passPhraseValidator);
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('User - Service Provider - Business data flow protocol', async () => {
        // to get this records, I used example application, created a wallet records and did copy&paste
        try {
            var wallet = '{"data":[{"data":"{\\"baseID\\":\\"03cb46e31c2d0f5827bb267f9fb30cf98077165d0e560b964651c6c379f69c7a35\\",\\"ethAddr\\":\\"0x916e1c7340f3f0a7af1a5b55e0fd9c3846ef8d28\\"}","sig":"0x08602606d842363d58e714e18f8c4d4b644c0cdc88d644dba03d0af3558f0691334a4db534034ba736347a085f28a58c9b643be25a9c7169f073f69a26b432531b"}],"sig":"IMBBXn+LLf4jWmjhQ1cWGmccuCZW9M5TwQYq46nXpCFUbs72Sxjn0hxOtmyNwiP4va97ZwCruqFyNhi3CuR1BvM="}';

            // create wallets for Alice and grantt access for Validator
            await baseUser.profileManager.updateData(new Map([[WalletManagerImpl.DATA_KEY_ETH_WALLETS, wallet]]));
            await baseUser.walletManager.addWealthValidator(accValidator.publicKey);

            // Validator retrieves the requests from Alice,Bob and Carol
            const requestsByFrom: Array<DataRequest> = await baseValidator.dataRequestManager.getRequests(
                accValidator.publicKey, ''
            );

            requestsByFrom.length.should.be.equal(1);
            const requestUser = requestsByFrom[0]

            // Validator decodes wallets for Alice, Bob and Carol
            const wealthMap: Map<string, string> = new Map<string, string>();
            const decryptedObj: Map<string, string> = await baseValidator.profileManager.getAuthorizedData(
                // accUser.publicKey,
                requestUser.toPk,
                requestUser.responseData
            );
            decryptedObj.get(WalletManagerImpl.DATA_KEY_ETH_WALLETS).should.be.equal(wallet);

            // validator verifies the ETH wallets
            var res: WalletVerificationStatus = WalletUtils.validateWallets(
                WalletManagerImpl.DATA_KEY_ETH_WALLETS,
                JSON.parse(wallet),
                accUser.publicKey
            );
            JSON.stringify(res).should.be.equal(JSON.stringify({ rc: 0, err: '', details: [0] }));

            // Here we simulate that Validator compute wealth for each requestor
            var wealth = '250';
            // ~compute wealth

            // Validator adds all wealth values to map
            const obj: any = { 'sig': await baseValidator.profileManager.signMessage(wealth) };
            obj[WalletManagerImpl.DATA_KEY_WEALTH] = wealth;

            wealthMap.set(accUser.publicKey, JSON.stringify(obj));


            // Validator writes wealth for all users to BASE
            // Validator stores the data in <key, value> map,
            // where key is the public key of the user that asked for verification
            baseValidator.profileManager.updateData(wealthMap);

            const grantFields: Map<string, AccessRight> = new Map();
            // Validator shares wealth records with the original owners of the wallets
            grantFields.clear();
            grantFields.set(accUser.publicKey, AccessRight.R);

            await baseValidator.dataRequestManager.grantAccessForClient(accUser.publicKey, grantFields);

            // Alice updates her internal wealth ptr record
            await baseUser.walletManager.refreshWealthPtr();

            // Alice shares the data with business
            // await baseAlice.dataRequestManager.grantAccessForClient(accBusiness.publicKey, ['wealth']);
            // !Alice shares the data with business

            // Business asks Alice for access
            /* const id: number = */
            await baseBusiness.dataRequestManager.requestPermissions(accUser.publicKey, [WalletManagerImpl.DATA_KEY_WEALTH]);

            // Alice checks for outstanding requests to her from Business
            const recordsForAliceToApprove: Array<DataRequest> = await baseUser.dataRequestManager.getRequests(
                accBusiness.publicKey, accUser.publicKey
            );

            recordsForAliceToApprove.length.should.be.equal(1);

            grantFields.clear();
            grantFields.set(WalletManagerImpl.DATA_KEY_WEALTH, AccessRight.R);
            // Alice approves the request
            await baseUser.dataRequestManager.grantAccessForClient(/* id */
                accBusiness.publicKey, grantFields);

            //Business reads wealth record from Alice
            const recordsForBusiness = await baseBusiness.dataRequestManager.getRequests(
                accBusiness.publicKey, accUser.publicKey
            );
            const wealthOfAlice: Map<string, string> = await baseBusiness.profileManager.getAuthorizedData(
                // accAlice.publicKey, recordsForBusiness[0].responseData);
                recordsForBusiness[0].toPk, recordsForBusiness[0].responseData);
            const wealthRecord: any = wealthOfAlice.get(WalletManagerImpl.DATA_KEY_WEALTH);
            const wealthRecordObject: WealthPtr = JSON.parse(wealthRecord);
            // console.log(wealthRecord);

            // business reads Alice's wealth from Validator's storage
            const rawData = await baseBusiness.profileManager.getRawData(wealthRecordObject.validator);
            var encryptedAliceWealth: any = rawData.get(accUser.publicKey);
            // business decodes Alice's wealth
            const decryptedAliceWealth: string = CryptoUtils.decryptAes256(encryptedAliceWealth, wealthRecordObject.decryptKey);
            // console.log("Alice's wealth as is seen by Business", decryptedAliceWealth);

            const decryptedAliceWealthObject: WealthRecord = JSON.parse(decryptedAliceWealth);

            // business verifies the signature of the wealth record
            const Message = require('bitcore-message');
            const bitcore = require('bitcore-lib');
            const addrValidator = bitcore.Address(bitcore.PublicKey(wealthRecordObject.validator));
            Message(decryptedAliceWealthObject.wealth).verify(addrValidator, decryptedAliceWealthObject.sig).should.be.true;
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

});