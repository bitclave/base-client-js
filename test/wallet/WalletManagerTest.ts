import * as SigUtil from 'eth-sig-util';
import * as EthUtil from 'ethereumjs-util';
import Base, { PermissionsSource, SiteDataSource } from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { DataRequest } from '../../src/repository/models/DataRequest';
import { CryptoUtils } from '../../src/utils/CryptoUtils';
import { AcceptedField } from '../../src/utils/keypair/AcceptedField';
import { KeyPairFactory } from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { MessageSigner } from '../../src/utils/keypair/MessageSigner';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import {
    AppWalletData,
    BtcWalletData,
    CryptoWallets,
    CryptoWalletsData,
    EthWalletData,
    UsdWalletData
} from '../../src/utils/types/BaseTypes';
import { WalletVerificationCodes } from '../../src/utils/types/validators/ValidationResult';
import { WalletUtils } from '../../src/utils/WalletUtils';
import { BaseClientHelper } from '../BaseClientHelper';

require('chai')
    .use(require('chai-as-promised'))
    .should();

const Message = require('bitcore-message');
const Bitcore = require('bitcore-lib');

describe('Wallet manager test', async () => {

    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    let keyPairHelperBob: KeyPairHelper;
    let keyPairHelperAlisa: KeyPairHelper;

    let baseAlice: Base;
    let baseBob: Base;
    let accountAlice: Account;
    let accountBob: Account;

    beforeEach(async () => {
        baseAlice = await BaseClientHelper.createRegistered(passPhraseAlisa);
        accountAlice = baseAlice.accountManager.getAccount();

        baseBob = await BaseClientHelper.createRegistered(passPhraseBob);
        accountBob = baseBob.accountManager.getAccount();

        keyPairHelperBob = KeyPairFactory.createDefaultKeyPair(
            baseBob.nodeManager,
            baseBob.nodeManager,
            'localhost'
        );

        keyPairHelperAlisa = KeyPairFactory.createDefaultKeyPair(
            baseAlice.nodeManager,
            baseAlice.nodeManager,
            'localhost'
        );

        await keyPairHelperBob.createKeyPair(passPhraseBob);
        await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
    });

    it('should decrypt foreign data', async () => {
        const origMockData: Map<string, string> = new Map();

        origMockData.set('name', 'Bob');
        await baseBob.profileManager.updateData(origMockData);

        const grantFields: Map<string, AccessRight> = new Map();
        grantFields.set('name', AccessRight.R);

        const encryptedFields = await keyPairHelperBob.encryptFieldsWithPermissions(
            accountAlice.publicKey, grantFields
        );

        const acceptedDataRequest: Array<DataRequest> = [];

        for (const [key, value] of encryptedFields.entries()) {
            acceptedDataRequest.push(new DataRequest(
                accountAlice.publicKey,
                accountBob.publicKey,
                accountBob.publicKey,
                key,
                value
            ));
        }

        const data = (await baseAlice.profileManager.getAuthorizedData(acceptedDataRequest))
            .getKeyValue(accountBob.publicKey);

        data.should.be.deep.equal(origMockData);
    });

    it('should extract decryption key', async () => {
        const origMockData: Map<string, string> = new Map();

        origMockData.set('name', 'Bob');

        await baseBob.profileManager.updateData(origMockData);

        const grantFields: Map<string, AccessRight> = new Map();
        grantFields.set('name', AccessRight.R);

        const encryptedFields = await keyPairHelperBob.encryptFieldsWithPermissions(
            accountAlice.publicKey, grantFields
        );

        const map: Map<string, AcceptedField> = new Map();
        const acceptedDataRequest: Array<DataRequest> = [];
        for (const [key, value] of encryptedFields.entries()) {
            const json = JSON.parse(await baseAlice.profileManager.decryptMessage(accountBob.publicKey, value));
            map.set(key, Object.assign(new AcceptedField('', AccessRight.R), json));
            acceptedDataRequest.push(new DataRequest(
                accountAlice.publicKey,
                accountBob.publicKey,
                accountBob.publicKey,
                key,
                value
            ));
        }

        const data: string = (await baseAlice.profileManager.getAuthorizedEncryptionKeys(acceptedDataRequest))
            .getKeyValue(accountBob.publicKey)
            .get('name') || '';

        const acceptedField: AcceptedField | undefined = map.get('name');
        const pass: string = acceptedField ? acceptedField.pass : '';

        data.should.be.equal(pass);
    });

    it('verify ETH address low level', async () => {
        // BASE (BitCoin-like) signature verification
        const keyPairHelper: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(
            {} as PermissionsSource,
            {} as SiteDataSource,
            ''
        );

        const messageSigner: MessageSigner = keyPairHelper;

        // create BASE user for tesing
        const baseUser = await keyPairHelper.createKeyPair('mnemonic for BASE user for testing');

        const baseUserAddr = new Bitcore.PrivateKey
            .fromString(baseUser.privateKey)
            .toAddress()
            .toString(16);

        const baseID = keyPairHelper.getPublicKey();

        // create ETH keys for testing
        const ethPrvKey1 = '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001';
        // the matching addr1 for the above key is 0x42cb8ae103896daee71ebb5dca5367f16727164a

        const ethAddr1 = '0x' + (EthUtil.privateToAddress(Buffer.from(ethPrvKey1, 'hex')) as Buffer).toString('hex');

        const ethPrvKey2 = '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369002';
        // the matching addr1 for the above key is 0x50575b106b1f96359f5e5dbe4c270443e6185f1f
        const ethAddr2 = '0x' + (EthUtil.privateToAddress(Buffer.from(ethPrvKey2, 'hex')) as Buffer).toString('hex');

        // sign string {baseID, eth_addr1, eth_addr2} with private keys for baseID, eth_addr1, eth_addr2
        const msg = {
            baseID: `${baseID}`,
            addr1: `${baseID}_${ethAddr1}`,
            addr2: `${baseID}_${ethAddr2}`
        };

        const msgParams1 = {data: msg.addr1, sig: ''};
        const msgParams2 = {data: msg.addr2, sig: ''};

        // sign ETH address1
        msgParams1.sig = SigUtil.personalSign(Buffer.from(ethPrvKey1, 'hex'), msgParams1);
        const pub1 = SigUtil.recoverPersonalSignature(msgParams1);
        pub1.should.be.equal(ethAddr1.toLowerCase());

        const dataForAddr1 = '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc75' +
            '4fd4f996_0x42cb8ae103896daee71ebb5dca5367f16727164a';

        // you can get this signature externally by using
        // https://www.myetherwallet.com/signmsg.html with private key ethPrvKey1 and dataForAddr1
        // or if you import ethPrvKey1 into MetaMask and sign with MetaMask
        // tslint:disable-next-line:max-line-length
        const sigForAddr1 = '0x5f9c14ab9613c4d4d604f9f6ed241ec736db1f2f1e3443da95dca23affc239df7e3' +
            '04553ea3a42469e2d56d51113979c2cb56cce2e3579f1c6fb23dd993fdbfc1b';

        msgParams1.data.should.be.equal(dataForAddr1);
        msgParams1.sig.should.be.equal(sigForAddr1);

        // sign ETH address1
        msgParams2.sig = SigUtil.personalSign(Buffer.from(ethPrvKey2, 'hex'), msgParams2);
        const pub2 = SigUtil.recoverPersonalSignature(msgParams2);
        pub2.should.be.equal(ethAddr2.toLowerCase());

        // sign BASE and ETH addresses all together
        const finalMsg = {
            data: {
                baseID: msg.baseID,
                addr1: msgParams1,
                addr2: msgParams2
            },
            sig: ''
        };

        finalMsg.sig = await messageSigner.signMessage(JSON.stringify(finalMsg.data));
        Message(JSON.stringify(finalMsg.data)).verify(baseUserAddr, finalMsg.sig).should.be.equal(true);
    });

    it('create ETH address record by BASE interface', () => {
        const msg: EthWalletData = WalletUtils.createEthereumWalletData(
            '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
        );
        const validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(msg);
        validation.message.length.should.be.eq(0);
        validation.state.length.should.be.eq(0);
    });

    it('create BTC address record by BASE interface', () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);
        const publicKey = privateKey.toPublicKey();
        const addr = privateKey.toAddress().toString(16);

        const privateKeyHex: string = privateKey.toString(16);
        const publicKeyHex = publicKey.toString(16);

        const msg: BtcWalletData = WalletUtils.createBtcWalletData(
            publicKeyHex,
            addr,
            privateKeyHex
        );

        const validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(msg);
        validation.message.length.should.be.eq(0);
        validation.state.length.should.be.eq(0);
    });

    it('create APP address record by BASE interface', () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);
        const publicKey = privateKey.toPublicKey();
        const publicKeyHex = publicKey.toString(16);

        const msg: AppWalletData = WalletUtils.createAppWalletData(
            publicKeyHex,
        );

        const validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(msg);
        validation.message.length.should.be.eq(0);
        validation.state.length.should.be.eq(0);
    });

    it('create APP/ETH/BTC/USD for CryptoWallets record by BASE interface', async () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);
        const addr = privateKey.toAddress().toString(16);

        const privateKeyHex: string = privateKey.toString(16);

        const baseId = accountAlice.publicKey;

        const app: AppWalletData = WalletUtils.createAppWalletData(
            baseId,
        );

        const usd: UsdWalletData = WalletUtils.createUsdWalletData(
            baseId,
            'test@test.com'
        );

        const btc: BtcWalletData = WalletUtils.createBtcWalletData(
            baseId,
            addr,
            privateKeyHex
        );

        const eth: EthWalletData = WalletUtils.createEthereumWalletData(
            baseId,
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
        );

        const walletsData = await baseAlice.walletManager
            .createCryptoWalletsData(new CryptoWallets([eth], [btc], [app], [usd]));

        const validation = WalletUtils.validateWalletsData(baseId, walletsData);

        validation.length.should.be.eq(0);
    });

    it('create APP/ETH/BTC/USD for CryptoWallets with wrong signature', async () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);
        const addr = privateKey.toAddress().toString(16);

        const privateKeyHex: string = privateKey.toString(16);

        const baseId = accountAlice.publicKey;

        const app: AppWalletData = WalletUtils.createAppWalletData(
            baseId,
        );

        const usd: UsdWalletData = WalletUtils.createUsdWalletData(
            baseId,
            'test@test.com'
        );

        const btc: BtcWalletData = WalletUtils.createBtcWalletData(
            baseId,
            addr,
            privateKeyHex
        );

        const eth: EthWalletData = WalletUtils.createEthereumWalletData(
            baseId,
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
        );

        const walletsData = await baseAlice.walletManager
            .createCryptoWalletsData(new CryptoWallets([eth], [btc], [app], [usd]));

        let validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(0);

        const json = JSON.parse(JSON.stringify(walletsData));

        validation = WalletUtils.validateWalletsData(baseId, CryptoWalletsData.fromJson(json));
        validation.length.should.be.eq(0);

        json.sig = 'some invalid signature';

        const restoredWalletsData = CryptoWalletsData.fromJson(json);
        validation = WalletUtils.validateWalletsData(baseId, restoredWalletsData);
        validation[0].state[0].should.be.eq(WalletVerificationCodes.WRONG_SIGNATURE);

        const walletsDataRestored = await baseAlice.walletManager.createCryptoWalletsData(restoredWalletsData.data);

        validation = WalletUtils.validateWalletsData(baseId, walletsDataRestored);
        validation.length.should.be.eq(0);
    });

    it('CryptoWallets should be have only unique wallets', async () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);
        const addr = privateKey.toAddress().toString(16);

        const privateKeyHex: string = privateKey.toString(16);

        const baseId = accountAlice.publicKey;

        const app: AppWalletData = WalletUtils.createAppWalletData(
            baseId,
        );

        const usd: UsdWalletData = WalletUtils.createUsdWalletData(
            baseId,
            'test@test.com'
        );

        const btc: BtcWalletData = WalletUtils.createBtcWalletData(
            baseId,
            addr,
            privateKeyHex
        );

        const eth: EthWalletData = WalletUtils.createEthereumWalletData(
            baseId,
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
        );

        let walletsData = await baseAlice.walletManager.createCryptoWalletsData(new CryptoWallets(
            [eth, eth],
            [btc],
            [app],
            [usd]
        ));
        let validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('eth should be have only unique items');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        walletsData = await baseAlice.walletManager
            .createCryptoWalletsData(new CryptoWallets([eth], [btc, btc], [app], [usd]));
        validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('btc should be have only unique items');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        walletsData = await baseAlice.walletManager
            .createCryptoWalletsData(new CryptoWallets([eth], [btc], [app, app], [usd]));
        validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('app should be have only unique items');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        walletsData = await baseAlice.walletManager
            .createCryptoWalletsData(new CryptoWallets([eth], [btc], [app], [usd, usd]));
        validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('usd should be have only unique items');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);
    });

    it('CryptoWallets should be have fixed types in array of wallets', async () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);
        const addr = privateKey.toAddress().toString(16);

        const privateKeyHex: string = privateKey.toString(16);

        const baseId = accountAlice.publicKey;

        const app: AppWalletData = WalletUtils.createAppWalletData(
            baseId,
        );

        const usd: UsdWalletData = WalletUtils.createUsdWalletData(
            baseId,
            'test@test.com'
        );

        const btc: BtcWalletData = WalletUtils.createBtcWalletData(
            baseId,
            addr,
            privateKeyHex
        );

        const eth: EthWalletData = WalletUtils.createEthereumWalletData(
            baseId,
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
        );

        let walletsData = await baseAlice.walletManager.createCryptoWalletsData(new CryptoWallets(
            [eth, btc, app, usd],
            [btc],
            [app],
            [usd]
        ));
        let validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('eth should be type of EthWalletData');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        walletsData = await baseAlice.walletManager.createCryptoWalletsData(new CryptoWallets(
            [eth],
            [btc, eth, app, usd],
            [app],
            [usd]
        ));
        validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('btc should be type of BtcWalletData');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        walletsData = await baseAlice.walletManager.createCryptoWalletsData(new CryptoWallets(
            [eth],
            [btc],
            [app, eth, btc, usd],
            [usd]
        ));
        validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('app should be type of AppWalletData');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        walletsData = await baseAlice.walletManager.createCryptoWalletsData(new CryptoWallets(
            [eth],
            [btc],
            [app],
            [app, eth, btc, usd]
        ));
        validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('usd should be type of UsdWalletData');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);
    });

    it('CryptoWallets should be have valid baseId', async () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);
        const addr = privateKey.toAddress().toString(16);

        const privateKeyHex: string = privateKey.toString(16);

        const baseId = 'wrong public key';

        const app: AppWalletData = WalletUtils.createAppWalletData(
            baseId,
            false
        );

        const usd: UsdWalletData = WalletUtils.createUsdWalletData(
            baseId,
            'testtest.com',
            false
        );

        const btc: BtcWalletData = WalletUtils.createBtcWalletData(
            baseId,
            addr,
            privateKeyHex,
            false
        );

        const eth: EthWalletData = WalletUtils.createEthereumWalletData(
            baseId,
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001',
            false
        );

        let validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(eth);
        validation.message[0].should.be.eq('must be valid Bitclave Base Id');
        validation.state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(btc);
        validation.message[0].should.be.eq('must be valid Bitclave Base Id');
        validation.state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(app);
        validation.message[0].should.be.eq('must be valid Bitclave App address');
        validation.state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(usd);
        validation.message[0].should.be.eq('must be valid Bitclave Base Id');
        validation.state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);
    });

    it('CryptoWallets should be have valid address', async () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);

        const privateKeyHex: string = privateKey.toString(16);

        const baseId = accountAlice.publicKey;

        const app: AppWalletData = WalletUtils.createAppWalletData(
            'some wrong address',
            false
        );

        const usd: UsdWalletData = WalletUtils.createUsdWalletData(
            'some wrong address',
            'test@test.com',
            false
        );

        const btc: BtcWalletData = WalletUtils.createBtcWalletData(
            baseId,
            'some wrong address',
            privateKeyHex,
            false
        );

        const eth: EthWalletData = WalletUtils.createEthereumWalletData(
            baseId,
            '0xSome wrong address',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001',
            false
        );

        let validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(eth);
        validation.message[0].should.be.eq('must be valid Ethereum address');
        validation.state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(btc);
        validation.message[0].should.be.eq('must be valid Bitcoin address');
        validation.state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(app);
        validation.message[0].should.be.eq('must be valid Bitclave App address');
        validation.state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(usd);
        validation.message[0].should.be.eq('must be valid Bitclave Base Id');
        validation.state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);
    });
});
