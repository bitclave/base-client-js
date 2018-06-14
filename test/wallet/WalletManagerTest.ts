import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import Account from '../../src/repository/models/Account';
import { ProfileManager } from '../../src/manager/ProfileManager';
import { RemoteSigner } from '../../src/utils/keypair/RemoteSigner';
import AuthenticatorHelper from '../AuthenticatorHelper';
import ClientDataRepositoryImplMock from '../profile/ClientDataRepositoryImplMock';
import DataRequestRepositoryImplMock from '../requests/DataRequestRepositoryImplMock';
import BaseEthUtils from '../wallet/BaseEthUtils';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { KeyPairFactory } from '../../src/utils/keypair/KeyPairFactory';
import { MessageSigner } from '../../src/utils/keypair/MessageSigner';
import { AddrRecord, WalletsRecords } from '../../src/utils/types/BaseTypes';
import { WalletManager } from '../../src/manager/WalletManager';
import { DataRequestManager } from '../../src/manager/DataRequestManager';
import { BaseSchema } from '../../src/utils/types/BaseSchema';
import { WalletUtils, WalletVerificationCodes } from '../../src/utils/WalletUtils';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { AcceptedField } from '../../src/utils/keypair/AcceptedField';
import { JsonUtils } from '../../src/utils/JsonUtils';
import { ProfileManagerImpl } from '../../src/manager/ProfileManagerImpl';
import { WalletManagerImpl } from '../../src/manager/WalletManagerImpl';
import { DataRequestManagerImpl } from '../../src/manager/DataRequestManagerImpl';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

const Message = require('bitcore-message');
const bitcore = require('bitcore-lib');

const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');

describe('Wallet manager test', async () => {

    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const rpcSignerHost: string = 'http://localhost:3545';

    const rpcTransport: RpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
    const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const keyPairHelperBob: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);

    const clientRepository: ClientDataRepositoryImplMock = new ClientDataRepositoryImplMock();
    const dataRepository: DataRequestRepositoryImplMock = new DataRequestRepositoryImplMock();

    const accountAlisa: Account;
    const authAccountBehaviorAlisa: BehaviorSubject<Account>;
    const accountBob: Account;
    const authAccountBehaviorBob: BehaviorSubject<Account>;

    const profileManager: ProfileManager;
    const profileManagerBob: ProfileManager;
    const walletManager: WalletManager;
    const requestManager: DataRequestManager;

    before(async () => {
        const alisaAccessToken = await authenticatorHelper.generateAccessToken(passPhraseAlisa);
        const bobAccessToken = await authenticatorHelper.generateAccessToken(passPhraseBob);

        (keyPairHelperAlisa as RemoteSigner).setAccessToken(alisaAccessToken);
        (keyPairHelperBob as RemoteSigner).setAccessToken(bobAccessToken);

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

        dataRepository.setPK(keyPairHelperAlisa.getPublicKey(), keyPairHelperBob.getPublicKey());

        requestManager = new DataRequestManagerImpl(
            dataRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );

        walletManager = new WalletManagerImpl(
            profileManager,
            requestManager,
            new BaseSchema(),
            keyPairHelperAlisa,
            authAccountBehaviorAlisa
        );
    });

    beforeEach(function (done) {
        clientRepository.clearData();
        done();
    });

    after(async () => {
        rpcTransport.disconnect();
    });

    it('should decrypt foreign data', async () => {
        const origMockData: Map<string, string> = new Map();
        const mockData: Map<string, string> = new Map();
        const originMessage: Map<string, string> = new Map();

        origMockData.set('name', 'Bob');
        await profileManagerBob.updateData(origMockData);

        const grantFields: Map<string, AccessRight> = new Map();
        grantFields.set('name', AccessRight.R);

        const encryptedMessage = await keyPairHelperBob.encryptPermissionsFields(
            keyPairHelperAlisa.getPublicKey(), grantFields
        );

        const data = await profileManager.getAuthorizedData(keyPairHelperBob.getPublicKey(), encryptedMessage);

        data.should.be.deep.equal(origMockData);
    });

    it('should extract decryption key', async () => {
        const origMockData: Map<string, string> = new Map();
        const mockData: Map<string, string> = new Map();
        const originMessage: Map<string, string> = new Map();

        origMockData.set('name', 'Bob');

        await profileManagerBob.updateData(origMockData);

        const grantFields: Map<string, AccessRight> = new Map();
        grantFields.set('name', AccessRight.R);

        const encryptedMessage = await keyPairHelperBob.encryptPermissionsFields(
            keyPairHelperAlisa.getPublicKey(), grantFields
        );

        const result: string = await keyPairHelperAlisa.decryptMessage(keyPairHelperBob.getPublicKey(), encryptedMessage);
        const map: Map<string, AcceptedField> = JsonUtils.jsonToMap(JSON.parse(result));

        const data: any = (await profileManager.getAuthorizedEncryptionKeys(
            keyPairHelperBob.getPublicKey(), encryptedMessage
        )).get('name');

        data.should.be.equal(map.get('name').pass);
    });

    it('verify ETH address low level', async () => {
        //BASE (BitCoin-like) signature verification
        const keyPairHelper: KeyPairHelper = KeyPairFactory.createDefaultKeyPair();
        const messageSigner: MessageSigner = keyPairHelper;

        // create BASE user for tesing
        const baseUser = await keyPairHelper.createKeyPair('mnemonic for BASE user for testing');

        const baseUserAddr = new bitcore.PrivateKey
            .fromString(baseUser.privateKey)
            .toAddress()
            .toString(16);

        var baseID = keyPairHelper.getPublicKey();

        // create ETH keys for testing
        var ethPrvKey1 = '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001';
        // the matching addr1 for the above key is 0x42cb8ae103896daee71ebb5dca5367f16727164a
        var ethAddr1 = '0x' + ethUtil.privateToAddress(Buffer.from(ethPrvKey1, 'hex')).toString('hex');

        var ethPrvKey2 = '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369002';
        // the matching addr1 for the above key is 0x50575b106b1f96359f5e5dbe4c270443e6185f1f
        var ethAddr2 = '0x' + ethUtil.privateToAddress(Buffer.from(ethPrvKey2, 'hex')).toString('hex');

        // sign string {baseID, eth_addr1, eth_addr2} with private keys for baseID, eth_addr1, eth_addr2
        var msg = {
            'baseID': baseID,
            'addr1': baseID + '_' + ethAddr1,
            'addr2': baseID + '_' + ethAddr2
        };

        const msgParams1 = {data: msg.addr1, sig: ''};
        const msgParams2 = {data: msg.addr2, sig: ''};

        // sign ETH address1
        msgParams1.sig = sigUtil.personalSign(Buffer.from(ethPrvKey1, 'hex'), msgParams1);
        var pub1 = sigUtil.recoverPersonalSignature(msgParams1);
        pub1.should.be.equal(ethAddr1.toLowerCase());

        var dataForAddr1 = '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996_0x42cb8ae103896daee71ebb5dca5367f16727164a';
        // you can get this signature externally by using https://www.myetherwallet.com/signmsg.html with private key ethPrvKey1 and dataForAddr1
        // or if you import ethPrvKey1 into MetaMask and sign with MetaMask
        var sigForAddr1 = '0x5f9c14ab9613c4d4d604f9f6ed241ec736db1f2f1e3443da95dca23affc239df7e304553ea3a42469e2d56d51113979c2cb56cce2e3579f1c6fb23dd993fdbfc1b';
        msgParams1.data.should.be.equal(dataForAddr1);
        msgParams1.sig.should.be.equal(sigForAddr1);

        // sign ETH address1
        msgParams2.sig = sigUtil.personalSign(Buffer.from(ethPrvKey2, 'hex'), msgParams2);
        var pub2 = sigUtil.recoverPersonalSignature(msgParams2);
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
        Message(JSON.stringify(finalMsg.data)).verify(baseUserAddr, finalMsg.sig).should.be.true;
    });

    it('create ETH address record by BASE interface', function () {
        var msg: AddrRecord = BaseEthUtils.createEthAddrRecord(
            '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
        );
        WalletUtils.verifyAddressRecord(msg).should.be.equal(WalletVerificationCodes.RC_OK);
    });

    it('verify ETH address record by BASE interface', function () {
        /*
        here is the exact string for message - pay attention to " " and "\n"
        "{\n  \"baseID\": \"02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41\",\n  \"ethAddr\": \"0x42cb8ae103896daee71ebb5dca5367f16727164a\"\n}"
         */
        WalletUtils.verifyAddressRecord(
            {
                'data': JSON.stringify(
                    {
                        baseID: '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                        ethAddr: '0x42cb8ae103896daee71ebb5dca5367f16727164a'
                    }),
                'sig': '0x5b5dfb8f20d10cd3e172eddab49a5a07d10acb0abadd889eb9bc441a35312fc4072dfa8e5dda313abba31c7e697532306061dfc2ee29cce0793d56ba18d975f31c'
            }
        ).should.be.equal(WalletVerificationCodes.RC_OK);

        WalletUtils.verifyAddressRecord(
            {
                'data': JSON.stringify(
                    {
                        _baseID: '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                        ethAddr: '0x42cb8ae103896daee71ebb5dca5367f16727164a'
                    }),
                'sig': '0x5b5dfb8f20d10cd3e172eddab49a5a07d10acb0abadd889eb9bc441a35312fc4072dfa8e5dda313abba31c7e697532306061dfc2ee29cce0793d56ba18d975f31c'
            }
        ).should.be.not.equal(WalletVerificationCodes.RC_OK);

        WalletUtils.verifyAddressRecord(
            {
                'data': JSON.stringify(
                    {
                        baseID: '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                        ethAddr: '0x42cb8ae103896daee71ebb5dca5367f16727164a'
                    }),
                'sig': '0x6b5dfb8f20d10cd3e172eddab49a5a07d10acb0abadd889eb9bc441a35312fc4072dfa8e5dda313abba31c7e697532306061dfc2ee29cce0793d56ba18d975f31c'
            }
        ).should.be.not.equal(WalletVerificationCodes.RC_OK);
    });

    it('create ETH Wallets record by BASE interface', async () => {
        const baseUser = await KeyPairFactory.createRpcKeyPair(rpcTransport);
        const baseUserAccessToken: string = await authenticatorHelper.generateAccessToken(
            'mnemonic for BASE user for testing'
        );

        baseUser.setAccessToken(baseUserAccessToken);
        await baseUser.createKeyPair('');

        baseUser.getPublicKey().should.be.equal('02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41');

        var msg = await BaseEthUtils.createEthWalletsRecordWithSigner(
            '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
            [
                WalletUtils.createEthereumAddersRecord(
                    '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                    '0x42cb8ae103896daee71ebb5dca5367f16727164a',
                    '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
                ),
                WalletUtils.createEthereumAddersRecord(
                    '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                    '0x50575b106b1f96359f5e5dbe4c270443e6185f1f',
                    '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369002'
                )
            ],
            '8ff8fdbfb47add1daf16ea856444ff1c76cc7a5617244acf6c103587e95fdf1e'
        );

        var rc = WalletUtils.validateWallets(WalletManagerImpl.DATA_KEY_ETH_WALLETS, msg, baseUser.getPublicKey());
        JSON.stringify(rc).should.be.equal(JSON.stringify(
            {
                rc: WalletVerificationCodes.RC_OK,
                err: '',
                details: [
                    WalletVerificationCodes.RC_OK,
                    WalletVerificationCodes.RC_OK
                ]
            }));

        var msg = await BaseEthUtils.createEthWalletsRecordDebug(
            '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
            [
                WalletUtils.createEthereumAddersRecord(
                    '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                    '0x42cb8ae103896daee71ebb5dca5367f16727164a',
                    '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
                ),
                WalletUtils.createEthereumAddersRecord(
                    '12ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                    '0x50575b106b1f96359f5e5dbe4c270443e6185f1f',
                    '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369002'
                )
            ],
            '8ff8fdbfb47add1daf16ea856444ff1c76cc7a5617244acf6c103587e95fdf1e'
        );

        var rc = WalletUtils.validateWallets(WalletManagerImpl.DATA_KEY_ETH_WALLETS, msg, baseUser.getPublicKey());
        JSON.stringify(rc).should.be.equal(JSON.stringify(
            {
                rc: WalletVerificationCodes.RC_OK,
                err: '',
                details: [
                    WalletVerificationCodes.RC_OK,
                    WalletVerificationCodes.RC_BASEID_MISSMATCH
                ]
            }));

        var rc = WalletUtils.validateWallets('error_eth_wallets', msg, baseUser.getPublicKey());
        rc.rc.should.be.equal(WalletVerificationCodes.RC_GENERAL_ERROR);

        const ethAddrRecord: AddrRecord = WalletUtils.createEthereumAddersRecord(
            '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
        );
        let sawException: boolean = false;
        try {
            await walletManager.createWalletsRecords([ethAddrRecord], 'wrong key');
        } catch (e) {
            sawException = true;
        }

        sawException.should.be.equal(true);

        const ethAddrRecord: AddrRecord = WalletUtils.createEthereumAddersRecord(
            '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
        );

        let walletsRecords: WalletsRecords = await walletManager.createWalletsRecords([ethAddrRecord], '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41');
        walletsRecords.data.length.should.be.equal(1);
    });

});