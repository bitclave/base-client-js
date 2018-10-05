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

const VALUE_KEY_SCHEME: string = "scheme";
const SEP: string = "_"
const SPID: string = "spid"
const UID: string = "uid"
const BID: string = "bid"

const KEY_WEALTH_PTR: string = "wealth_ptr";
const WEALTH_KEY_SCHEME: string = UID + SEP + SPID + SEP + "wealth";
const NONCE_KEY_SCHEME: string = UID + SEP + SPID + SEP + "nonce";

interface Pointer {
    spid: string;
    scheme: string;
}

// User write an entry into his own storage after receiving shared back data from
// service provider
async function userWriteWealthPtr(user: Base, serviceProviderID: string) {
    const value: any = {}
    value[VALUE_KEY_SCHEME] = WEALTH_KEY_SCHEME;
    value[SPID] = serviceProviderID;
    const data: Map<string, string> = new Map<string, string>();
    data.set(KEY_WEALTH_PTR, JSON.stringify(value));
    await user.profileManager.updateData(data);
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

    private function getNonceKey(uid: string, spid: string): string {
        return uid + SEP + spid + SEP + "nonce";
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

            // Step 1: create wallets for User and grant access for Validator
            await baseUser.profileManager.updateData(new Map([[WalletManagerImpl.DATA_KEY_ETH_WALLETS, wallet]]));
            // Step 2: user grant data to service provider
            const grantFields: Map<string, AccessRight> = new Map();
            grantFields.set(WalletManagerImpl.DATA_KEY_ETH_WALLETS, AccessRight.R);
            await baseUser.dataRequestManager.grantAccessForClient(accValidator.publicKey, grantFields);

            // Validator retrieves the requests from user
            const requestsByFrom: Array<DataRequest> = await baseValidator.dataRequestManager.getRequests(
                accValidator.publicKey, ''
            );

            requestsByFrom.length.should.be.equal(1);
            const requestUser = requestsByFrom[0]

            // Validator decodes wallets for User and calculate wealth
            const wealthMap: Map<string, string> = new Map<string, string>();
            const decryptedObj: Map<string, string> = await baseValidator.profileManager.getAuthorizedData(
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
            var wealth = '15213';
            // ~compute wealth

            // Step 3: Validator create a corresponding entries into its base.
            // The value is a json object containing the calculated wealth, and key is the user's public key
            const obj: any = {};
            obj[WalletManagerImpl.DATA_KEY_WEALTH] = wealth;
            wealthMap.set(requestUser.toPk, JSON.stringify(obj));
            baseValidator.profileManager.updateData(wealthMap);

            // Step 4: Validator shares back this entry to user
            grantFields.clear();
            grantFields.set(requestUser.toPk, AccessRight.R);
            await baseValidator.dataRequestManager.grantAccessForClient(accUser.publicKey, grantFields);


            // Step 5: Users receives the shared record, write a new record into Base
            await userWriteWealthPtr(baseUser, accValidator.publicKey);


            // Step 6: Business request wealth record from user
            await baseBusiness.dataRequestManager.requestPermissions(accUser.publicKey, [KEY_WEALTH_PTR]);


            // Step 7: User checks for outstanding requests from Business
            const recordsForUserToApprove: Array<DataRequest> = await baseUser.dataRequestManager.getRequests(
                accBusiness.publicKey, accUser.publicKey
            );
            recordsForUserToApprove.length.should.be.equal(1);

            // TODO: how data request is encoded into base64
            // recordsForUserToApprove[0].requestData.should.be.equal(KEY_WEALTH_PTR);

            grantFields.clear();
            grantFields.set(KEY_WEALTH_PTR, AccessRight.R);
            // User approves the request
            await baseUser.dataRequestManager.grantAccessForClient(/* id */
                accBusiness.publicKey, grantFields);

            //Business reads wealth pointer from User
            const recordsForBusiness = await baseBusiness.dataRequestManager.getRequests(
                accBusiness.publicKey, accUser.publicKey
            );

            recordsForBusiness.length.should.be.equal(1);

            const wealthPtrMap: Map<string, string> = await baseBusiness.profileManager.getAuthorizedData(
                recordsForBusiness[0].toPk, recordsForBusiness[0].responseData);
            const wealthPtr: Pointer = JSON.parse(wealthPtrMap.get(KEY_WEALTH_PTR));

            // Business get the Service Provider ID and SP key scheme
            wealthPtr.spid.should.be.equal(accValidator.publicKey);
            wealthPtr.scheme.should.be.equal(WEALTH_KEY_SCHEME);

            // Step 8: Business write nonce to its storage
            const nonceKey = getNonceKey(accUser.publicKey, accValidator.publicKey);
            const nonceValue = '14829';
            baseBusiness.profileManager.updateData(new Map([[nonceKey, nonceValue]]));

            // Step 9: Business grants nonce to User
            grantFields.clear();
            grantFields.set(nonceKey, AccessRight.R);
            await baseBusiness.dataRequestManager.grantAccessForClient(accUser.publicKey, grantFields);

            const recordsForUser = await baseUser.dataRequestManager.getRequests(
                accUser.publicKey, accBusiness.publicKey
            );

            recordsForUser.length.should.be.equal(1);
            const nonceMap: Map<string, string> = await baseUser.profileManager.getAuthorizedData(
                recordsForUser[0].toPk, recordsForUser[0].responseData);
            nonceMap[nonceKey].should.be.equal(nonceValue)


            // Test the retrieved wealthPtr data is correct at service provider side
            // var testWealthPtr: any = {}
            // testWealthPtr[VALUE_KEY_SCHEME] = WEALTH_KEY_SCHEME;
            // testWealthPtr[SPID] = accValidator.publicKey;
            // wealthPtrValue.should.be.equal(JSON.stringify(testWealthPtr));
            // const wealthRecordObject: WealthPtr = JSON.parse(wealthRecord);
            // // console.log(wealthRecord);

            // // business reads User's wealth from Validator's storage
            // const rawData = await baseBusiness.profileManager.getRawData(wealthRecordObject.validator);
            // var encryptedUserWealth: any = rawData.get(accUser.publicKey);
            // // business decodes User's wealth
            // const decryptedUserWealth: string = CryptoUtils.decryptAes256(encryptedUserWealth, wealthRecordObject.decryptKey);
            // // console.log("User's wealth as is seen by Business", decryptedUserWealth);

            // const decryptedUserWealthObject: WealthRecord = JSON.parse(decryptedUserWealth);

            // // business verifies the signature of the wealth record
            // const Message = require('bitcore-message');
            // const bitcore = require('bitcore-lib');
            // const addrValidator = bitcore.Address(bitcore.PublicKey(wealthRecordObject.validator));
            // Message(decryptedUserWealthObject.wealth).verify(addrValidator, decryptedUserWealthObject.sig).should.be.true;
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

});