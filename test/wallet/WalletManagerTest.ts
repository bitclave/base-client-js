import * as SigUtil from 'eth-sig-util';
import * as EthUtil from 'ethereumjs-util';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataRequestManager } from '../../src/manager/DataRequestManager';
import { DataRequestManagerImpl } from '../../src/manager/DataRequestManagerImpl';
import { ProfileManager } from '../../src/manager/ProfileManager';
import { ProfileManagerImpl } from '../../src/manager/ProfileManagerImpl';
import { WalletManager } from '../../src/manager/WalletManager';
import { WalletManagerImpl } from '../../src/manager/WalletManagerImpl';
import Account from '../../src/repository/models/Account';
import { DataRequest } from '../../src/repository/models/DataRequest';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import { CryptoUtils } from '../../src/utils/CryptoUtils';
import { AcceptedField } from '../../src/utils/keypair/AcceptedField';
import { KeyPairFactory } from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { MessageSigner } from '../../src/utils/keypair/MessageSigner';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { RemoteKeyPairHelper } from '../../src/utils/keypair/RemoteKeyPairHelper';
import {
    AppWalletData,
    BtcWalletData,
    CryptoWallets,
    CryptoWalletsData,
    EthWalletData
} from '../../src/utils/types/BaseTypes';
import { WalletVerificationCodes } from '../../src/utils/types/validators/ValidationResult';
import { WalletUtils } from '../../src/utils/WalletUtils';
import AuthenticatorHelper from '../AuthenticatorHelper';
import ClientDataRepositoryImplMock from '../profile/ClientDataRepositoryImplMock';
import { AssistantPermissions } from '../requests/AssistantPermissions';
import DataRequestRepositoryImplMock from '../requests/DataRequestRepositoryImplMock';

const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';

require('chai')
    .use(require('chai-as-promised'))
    .should();

const Message = require('bitcore-message');
const Bitcore = require('bitcore-lib');

describe('Wallet manager test', async () => {

    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const rpcTransport: RpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
    const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

    const keyPairHelperAlisa: RemoteKeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const keyPairHelperBob: RemoteKeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);

    const clientRepository: ClientDataRepositoryImplMock = new ClientDataRepositoryImplMock();
    const dataRepository: DataRequestRepositoryImplMock = new DataRequestRepositoryImplMock();

    const assistant: AssistantPermissions = new AssistantPermissions(dataRepository);

    let accountAlisa: Account;
    let authAccountBehaviorAlisa: BehaviorSubject<Account>;
    let accountBob: Account;
    let authAccountBehaviorBob: BehaviorSubject<Account>;

    let profileManager: ProfileManager;
    let profileManagerBob: ProfileManager;
    let walletManager: WalletManager;
    let requestManager: DataRequestManager;

    before(async () => {
        const alisaAccessToken = await authenticatorHelper.generateAccessToken(passPhraseAlisa);
        const bobAccessToken = await authenticatorHelper.generateAccessToken(passPhraseBob);

        keyPairHelperAlisa.setAccessToken(alisaAccessToken);
        keyPairHelperBob.setAccessToken(bobAccessToken);

        await keyPairHelperAlisa.createKeyPair('');
        await keyPairHelperBob.createKeyPair('');

        accountAlisa = new Account((await keyPairHelperAlisa.createKeyPair('')).publicKey);
        authAccountBehaviorAlisa = new BehaviorSubject<Account>(accountAlisa);

        accountBob = new Account((await keyPairHelperBob.createKeyPair('')).publicKey);
        authAccountBehaviorBob = new BehaviorSubject<Account>(accountBob);

        profileManager = new ProfileManagerImpl(
            clientRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );

        profileManagerBob = new ProfileManagerImpl(
            clientRepository,
            authAccountBehaviorBob,
            keyPairHelperBob,
            keyPairHelperBob,
            keyPairHelperBob
        );

        dataRepository.setPK(keyPairHelperAlisa.getPublicKey());

        requestManager = new DataRequestManagerImpl(
            dataRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );

        walletManager = new WalletManagerImpl(
            profileManager,
            requestManager,
            WalletUtils.WALLET_VALIDATOR,
            keyPairHelperAlisa,
            authAccountBehaviorAlisa
        );
    });

    beforeEach(async () => {
        clientRepository.clearData();
    });

    after(async () => {
        rpcTransport.disconnect();
    });

    it('should decrypt foreign data', async () => {
        const origMockData: Map<string, string> = new Map();

        origMockData.set('name', 'Bob');
        await profileManagerBob.updateData(origMockData);

        const grantFields: Map<string, AccessRight> = new Map();
        grantFields.set('name', AccessRight.R);

        const encryptedFields = await keyPairHelperBob.encryptFieldsWithPermissions(
            keyPairHelperAlisa.getPublicKey(), grantFields
        );

        const acceptedDataRequest: Array<DataRequest> = [];
        for (const [key, value] of encryptedFields.entries()) {
            acceptedDataRequest.push(new DataRequest(
                keyPairHelperAlisa.getPublicKey(),
                keyPairHelperBob.getPublicKey(),
                keyPairHelperBob.getPublicKey(),
                key,
                value
            ));
        }

        const data = (await profileManager.getAuthorizedData(acceptedDataRequest))
            .getKeyValue(keyPairHelperBob.getPublicKey());

        data.should.be.deep.equal(origMockData);
    });

    it('should extract decryption key', async () => {
        const origMockData: Map<string, string> = new Map();

        origMockData.set('name', 'Bob');

        await profileManagerBob.updateData(origMockData);

        const grantFields: Map<string, AccessRight> = new Map();
        grantFields.set('name', AccessRight.R);

        const encryptedFields = await keyPairHelperBob.encryptFieldsWithPermissions(
            keyPairHelperAlisa.getPublicKey(), grantFields
        );

        const map: Map<string, AcceptedField> = new Map();
        const acceptedDataRequest: Array<DataRequest> = [];
        for (const [key, value] of encryptedFields.entries()) {
            const json = JSON.parse(await keyPairHelperAlisa.decryptMessage(keyPairHelperBob.getPublicKey(), value));
            map.set(key, Object.assign(new AcceptedField('', AccessRight.R), json));
            acceptedDataRequest.push(new DataRequest(
                keyPairHelperAlisa.getPublicKey(),
                keyPairHelperBob.getPublicKey(),
                keyPairHelperBob.getPublicKey(),
                key,
                value
            ));
        }

        const data: string = (await profileManager.getAuthorizedEncryptionKeys(acceptedDataRequest))
            .getKeyValue(keyPairHelperBob.getPublicKey())
            .get('name') || '';

        const acceptedField: AcceptedField | undefined = map.get('name');
        const pass: string = acceptedField ? acceptedField.pass : '';

        data.should.be.equal(pass);
    });

    it('verify ETH address low level', async () => {
        // BASE (BitCoin-like) signature verification
        const keyPairHelper: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(assistant, assistant, '');
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

    it('create APP/ETH/BTC for CryptoWallets record by BASE interface', async () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);
        const addr = privateKey.toAddress().toString(16);

        const privateKeyHex: string = privateKey.toString(16);

        const baseId = authAccountBehaviorAlisa.getValue().publicKey;

        const app: AppWalletData = WalletUtils.createAppWalletData(
            baseId,
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

        const walletsData = await walletManager.createCryptoWalletsData(new CryptoWallets([eth], [btc], [app]));

        const validation = WalletUtils.validateWalletsData(baseId, walletsData);

        validation.length.should.be.eq(0);
    });

    it('create APP/ETH/BTC for CryptoWallets with wrong signature', async () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);
        const addr = privateKey.toAddress().toString(16);

        const privateKeyHex: string = privateKey.toString(16);

        const baseId = authAccountBehaviorAlisa.getValue().publicKey;

        const app: AppWalletData = WalletUtils.createAppWalletData(
            baseId,
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

        const walletsData = await walletManager.createCryptoWalletsData(new CryptoWallets([eth], [btc], [app]));

        let validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(0);

        const json = JSON.parse(JSON.stringify(walletsData));

        validation = WalletUtils.validateWalletsData(baseId, CryptoWalletsData.fromJson(json));
        validation.length.should.be.eq(0);

        json.sig = 'some invalid signature';

        const restoredWalletsData = CryptoWalletsData.fromJson(json);
        validation = WalletUtils.validateWalletsData(baseId, restoredWalletsData);
        validation[0].state[0].should.be.eq(WalletVerificationCodes.WRONG_SIGNATURE);

        const walletsDataRestored = await walletManager.createCryptoWalletsData(restoredWalletsData.data);

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

        const baseId = authAccountBehaviorAlisa.getValue().publicKey;

        const app: AppWalletData = WalletUtils.createAppWalletData(
            baseId,
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

        let walletsData = await walletManager.createCryptoWalletsData(new CryptoWallets([eth, eth], [btc], [app]));
        let validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('eth should be have only unique items');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        walletsData = await walletManager.createCryptoWalletsData(new CryptoWallets([eth], [btc, btc], [app]));
        validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('btc should be have only unique items');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        walletsData = await walletManager.createCryptoWalletsData(new CryptoWallets([eth], [btc], [app, app]));
        validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('app should be have only unique items');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);
    });

    it('CryptoWallets should be have fixed types in array of wallets', async () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);
        const addr = privateKey.toAddress().toString(16);

        const privateKeyHex: string = privateKey.toString(16);

        const baseId = authAccountBehaviorAlisa.getValue().publicKey;

        const app: AppWalletData = WalletUtils.createAppWalletData(
            baseId,
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

        let walletsData = await walletManager.createCryptoWalletsData(new CryptoWallets([eth, btc, app], [btc], [app]));
        let validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('eth should be type of EthWalletData');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        walletsData = await walletManager.createCryptoWalletsData(new CryptoWallets([eth], [btc, eth, app], [app]));
        validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('btc should be type of BtcWalletData');
        validation[0].state[0].should.be.eq(WalletVerificationCodes.SCHEMA_MISSMATCH);

        walletsData = await walletManager.createCryptoWalletsData(new CryptoWallets([eth], [btc], [app, eth, btc]));
        validation = WalletUtils.validateWalletsData(baseId, walletsData);
        validation.length.should.be.eq(1);
        validation[0].message[0].should.be.eq('app should be type of AppWalletData');
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
    });

    it('CryptoWallets should be have valid address', async () => {
        const pbkdf2: string = CryptoUtils.PBKDF2('some password', 256);
        const hash = Bitcore.crypto.Hash.sha256(new Bitcore.deps.Buffer(pbkdf2));
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new Bitcore.PrivateKey(bn);

        const privateKeyHex: string = privateKey.toString(16);

        const baseId = authAccountBehaviorAlisa.getValue().publicKey;

        const app: AppWalletData = WalletUtils.createAppWalletData(
            'some wrong address',
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
    });
});
