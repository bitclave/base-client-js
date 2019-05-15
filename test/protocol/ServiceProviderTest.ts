// tslint:disable:no-unused-expression
import * as Bip39 from 'bip39';
import * as EthUtils from 'ethereumjs-util';
import Base, { CryptoWallets, CryptoWalletsData } from '../../src/Base';
import { WalletManagerImpl } from '../../src/manager/WalletManagerImpl';
import Account from '../../src/repository/models/Account';
import { DataRequest } from '../../src/repository/models/DataRequest';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { WalletUtils } from '../../src/utils/WalletUtils';
import AuthenticatorHelper from '../AuthenticatorHelper';

const HdKey = require('hdkey');

require('chai')
    .use(require('chai-as-promised'))
    .should();

const SEP: string = '_';
const UID: string = 'uid';
const BID: string = 'bid';

const KEY_WEALTH_PTR: string = 'wealth_ptr';
const WEALTH_KEY_SCHEME: string = UID + SEP + BID + SEP + 'wealth';

const someSigMessage = 'some unique message for signature';
const rpcSignerHost: string = 'http://localhost:3545';
const rpcTransport: RpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

class Pointer {
    public spid: string;
    public scheme: string;
}

class SignedMessage {
    public message: string;
    public signature: string;
}

class Token {
    public bid: string;
    public nonce: string;
    public hash: string;
    public timestamp: string;
}

class WealthEntry {
    public wealth: string;
    public token: string;
}

function getNonceKey(uid: string, spid: string): string {
    return uid + SEP + spid + SEP + 'nonce';
}

function getTokenKey(bid: string, spid: string): string {
    return bid + SEP + spid + SEP + 'token';
}

function getWealthEntryKey(uid: string, bid: string): string {
    return uid + SEP + bid + SEP + 'wealth';
}

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

describe('BASE API test: Protocol Flow', async () => {
    const passPhraseUser: string = 'Alice';
    const passPhraseBusiness: string = 'Business';
    const passPhraseValidator: string = 'Validator';

    const baseUser: Base = createBase();
    const baseBusiness: Base = createBase();
    const baseValidator: Base = createBase();

    let accUser: Account;
    let accBusiness: Account;
    let accValidator: Account;

    function createBase(): Base {
        const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
        return new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );
    }

    function getHash(message: string): string {
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(message).digest('hex');
    }

    // User write an entry into his own storage after receiving shared back data from
    // service provider
    async function userWriteWealthPtr(user: Base, spid: string) {
        const value = new Pointer();
        value.scheme = WEALTH_KEY_SCHEME;
        value.spid = spid;
        const data = new Map<string, string>();
        data.set(KEY_WEALTH_PTR, JSON.stringify(value));
        await user.profileManager.updateData(data);
    }

    async function userWriteSignedToken(user: Base, key: string, bid: string, nonce: string, processedData: string) {
        const token = new Token();
        token.bid = bid;
        token.nonce = nonce;
        token.hash = getHash(processedData);
        token.timestamp = Date.now().toString();
        const tokenString = JSON.stringify(token);
        const signedToken = new SignedMessage();
        signedToken.message = tokenString;
        signedToken.signature = await user.profileManager.signMessage(tokenString);
        const data = new Map<string, string>();
        data.set(key, JSON.stringify(signedToken));
        await user.profileManager.updateData(data);
    }

    async function spWriteWealthEntry(sp: Base, key: string, wealth: string, token: string) {
        const wealthEntry = new WealthEntry();
        wealthEntry.wealth = wealth;
        wealthEntry.token = token;
        const wealthEntryString = JSON.stringify(wealthEntry);
        const data = new Map<string, string>();
        data.set(key, wealthEntryString);
        await sp.profileManager.updateData(data);
    }

    beforeEach(async () => {
        accUser = await createUser(baseUser, passPhraseUser);
        accBusiness = await createUser(baseBusiness, passPhraseBusiness);
        accValidator = await createUser(baseValidator, passPhraseValidator);
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('User - Service Provider - Business data flow protocol', async () => {
        // to get this records, I used example application, created a data records and did copy&paste
        try {
            const baseId = baseUser.accountManager.getAccount().publicKey;

            const mnemonic = Bip39.generateMnemonic();
            const seed = await Bip39.mnemonicToSeed(mnemonic);

            const privateKeyBuffer = HdKey.fromMasterSeed(seed).privateKey;
            const privateKeyHex = (privateKeyBuffer as Buffer).toString('hex');
            const address = EthUtils.addHexPrefix(
                (EthUtils.privateToAddress(privateKeyBuffer) as Buffer).toString('hex')
            );

            const ethWallet = WalletUtils.createEthereumWalletData(baseId, address, privateKeyHex);
            const wallets = new CryptoWallets([ethWallet], [], []);
            const walletsData = await baseUser.walletManager.createCryptoWalletsData(wallets);

            const wallet = JSON.stringify(walletsData);

            // Step 1: create wallets for User and grant access for Validator
            await baseUser.profileManager.updateData(new Map([[WalletManagerImpl.DATA_KEY_CRYPTO_WALLETS, wallet]]));
            // Step 2: user grant data to service provider
            const grantFields: Map<string, AccessRight> = new Map();
            grantFields.set(WalletManagerImpl.DATA_KEY_CRYPTO_WALLETS, AccessRight.R);
            await baseUser.dataRequestManager.grantAccessForClient(accValidator.publicKey, grantFields);

            // Validator retrieves the requests from user
            let recordsForValidator: Array<DataRequest> = await baseValidator.dataRequestManager.getRequests(
                accValidator.publicKey, accUser.publicKey
            );

            recordsForValidator.length.should.be.equal(1);

            // Validator decodes wallets for User and calculate wealth
            const wealthMap: Map<string, string> = new Map<string, string>();
            const decryptedObj: Map<string, string> = await baseValidator.profileManager
                .getAuthorizedData(recordsForValidator);
            (decryptedObj.get(WalletManagerImpl.DATA_KEY_CRYPTO_WALLETS) as string).should.be.equal(wallet);

            const jsonCryptoWalletsData = JSON.parse(wallet);
            // validator verifies the ETH wallets

            const res = WalletUtils.validateWalletsData(
                baseId,
                CryptoWalletsData.fromJson(jsonCryptoWalletsData),
            );

            res.length.should.be.equal(0);

            // Here we simulate that Validator compute wealth for each requestor
            const wealth = '15213';
            // ~compute wealth

            // Step 3: Validator create a corresponding entries into its base
            // The value is the calculated wealth, and key is the user's public key
            const userDataRequest = recordsForValidator[0];
            wealthMap.set(userDataRequest.toPk, wealth);
            await baseValidator.profileManager.updateData(wealthMap);

            // Step 4: Validator shares back this entry to user
            grantFields.clear();
            grantFields.set(userDataRequest.toPk, AccessRight.R);
            await baseValidator.dataRequestManager.grantAccessForClient(accUser.publicKey, grantFields);

            // Test user receives the shared data
            let recordsForUser: Array<DataRequest> = await baseUser.dataRequestManager.getRequests(
                accUser.publicKey, accValidator.publicKey
            );

            recordsForUser.length.should.be.equal(1);
            const processedDataMap: Map<string, string> = await baseUser.profileManager
                .getAuthorizedData(recordsForUser);

            const processedData = processedDataMap.get(accUser.publicKey) as string;
            processedData.should.be.equal(wealth);

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
            await baseUser.dataRequestManager.grantAccessForClient(/* id */ accBusiness.publicKey, grantFields);

            // Business reads wealth pointer from User
            let recordsForBusiness: Array<DataRequest> = await baseBusiness.dataRequestManager
                .getRequests(accBusiness.publicKey, accUser.publicKey);

            recordsForBusiness.length.should.be.equal(1);

            const wealthPtrMap: Map<string, string> = await baseBusiness.profileManager
                .getAuthorizedData(recordsForBusiness);

            const wealthPtr: Pointer = JSON.parse(wealthPtrMap.get(KEY_WEALTH_PTR) as string);

            // Business get the Service Provider ID and SP key scheme
            wealthPtr.spid.should.be.equal(accValidator.publicKey);
            wealthPtr.scheme.should.be.equal(WEALTH_KEY_SCHEME);

            // Step 8: Business write nonce to its storage
            const nonceKey = getNonceKey(accUser.publicKey, wealthPtr.spid);
            const nonceValue = Math.floor(Math.random() * 1000000).toString();
            await baseBusiness.profileManager.updateData(new Map([[nonceKey, nonceValue]]));

            // Step 9: Business grants nonce to User
            grantFields.clear();
            grantFields.set(nonceKey, AccessRight.R);
            await baseBusiness.dataRequestManager.grantAccessForClient(accUser.publicKey, grantFields);

            recordsForUser = await baseUser.dataRequestManager.getRequests(
                accUser.publicKey, accBusiness.publicKey
            );

            recordsForUser.length.should.be.equal(1);
            const nonceMap: Map<string, string> = await baseUser.profileManager.getAuthorizedData(recordsForUser);
            (nonceMap.get(nonceKey) as string).should.be.equal(nonceValue);

            // Step 10: User write signed token
            const tokenKey = getTokenKey(accBusiness.publicKey, accValidator.publicKey);
            await userWriteSignedToken(baseUser, tokenKey, accBusiness.publicKey, nonceValue, processedData);

            // Step 11: User grant token to Validator
            grantFields.clear();
            grantFields.set(tokenKey, AccessRight.R);
            await baseUser.dataRequestManager.grantAccessForClient(accValidator.publicKey, grantFields);

            // Test Validator receives the token
            recordsForValidator = await baseValidator.dataRequestManager.getRequests(
                accValidator.publicKey, accUser.publicKey
            );

            recordsForValidator.length.should.be.equal(2); // wallets and token
            const tokenMap: Map<string, string> = await baseValidator.profileManager
                .getAuthorizedData(recordsForValidator);

            // Step 12: Validator write signed token and processed data
            const wealthEntryKey = getWealthEntryKey(accUser.publicKey, accBusiness.publicKey);
            await spWriteWealthEntry(baseValidator, wealthEntryKey, wealth, tokenMap.get(tokenKey) as string);

            // Step 13, 14: grant wealth entry to business and user
            grantFields.clear();
            grantFields.set(wealthEntryKey, AccessRight.R);
            await baseValidator.dataRequestManager.grantAccessForClient(accBusiness.publicKey, grantFields);
            await baseValidator.dataRequestManager.grantAccessForClient(accUser.publicKey, grantFields);

            // Test Business receives the wealth data and verified it with the signed token
            recordsForBusiness = await baseBusiness.dataRequestManager.getRequests(
                accBusiness.publicKey, accValidator.publicKey
            );
            recordsForBusiness.length.should.be.equal(1);

            // Step 15: get wealth entry and verify the signed token
            const wealthEntryMap: Map<string, string> = await baseBusiness.profileManager
                .getAuthorizedData(recordsForBusiness);

            const wealthEntry: WealthEntry = JSON.parse(wealthEntryMap.get(wealthEntryKey) as string);
            wealthEntry.wealth.should.be.equal(wealth);
            const signedToken: SignedMessage = JSON.parse(wealthEntry.token);

            // Business verify the signature of the token
            const Message = require('bitcore-message');
            const bitcore = require('bitcore-lib');
            const addrUser = bitcore.Address(bitcore.PublicKey(accUser.publicKey));

            // noinspection BadExpressionStatementJS
            Message(signedToken.message).verify(addrUser, signedToken.signature).should.be.true;

            const token: Token = JSON.parse(signedToken.message);

            // Business verify the bid from token
            token.bid.should.be.equal(accBusiness.publicKey);

            // Business verify the nonce from token
            token.nonce.should.be.equal(nonceValue);

            // Business verify the data hash from token
            token.hash.should.be.equal(getHash(processedData));

            // Business read the timestamp from token
            const timestampDate = new Date();
            timestampDate.setTime(Number(token.timestamp));
            // console.log("Business received token timestamp: " + timestampDate.toString());

        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
