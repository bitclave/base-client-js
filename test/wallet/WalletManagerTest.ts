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
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import { JsonUtils } from '../../src/utils/JsonUtils';
import { AcceptedField } from '../../src/utils/keypair/AcceptedField';
import { KeyPairFactory } from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { MessageSigner } from '../../src/utils/keypair/MessageSigner';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { RemoteKeyPairHelper } from '../../src/utils/keypair/RemoteKeyPairHelper';
import { BaseSchema } from '../../src/utils/types/BaseSchema';
import { AddrRecord, WalletsRecords } from '../../src/utils/types/BaseTypes';
import { WalletUtils, WalletVerificationCodes } from '../../src/utils/WalletUtils';
import AuthenticatorHelper from '../AuthenticatorHelper';
import ClientDataRepositoryImplMock from '../profile/ClientDataRepositoryImplMock';
import { AssistantPermissions } from '../requests/AssistantPermissions';
import DataRequestRepositoryImplMock from '../requests/DataRequestRepositoryImplMock';
import BaseEthUtils from '../wallet/BaseEthUtils';

const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';

require('chai')
    .use(require('chai-as-promised'))
    .should();

const Message = require('bitcore-message');
const bitcore = require('bitcore-lib');

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
            new BaseSchema(),
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

        const encryptedMessage = await keyPairHelperBob.encryptPermissionsFields(
            keyPairHelperAlisa.getPublicKey(), grantFields
        );

        const data = await profileManager.getAuthorizedData(keyPairHelperBob.getPublicKey(), encryptedMessage);

        data.should.be.deep.equal(origMockData);
    });

    it('should extract decryption key', async () => {
        const origMockData: Map<string, string> = new Map();

        origMockData.set('name', 'Bob');

        await profileManagerBob.updateData(origMockData);

        const grantFields: Map<string, AccessRight> = new Map();
        grantFields.set('name', AccessRight.R);

        const encryptedMessage = await keyPairHelperBob.encryptPermissionsFields(
            keyPairHelperAlisa.getPublicKey(), grantFields
        );

        const result: string = await keyPairHelperAlisa
            .decryptMessage(keyPairHelperBob.getPublicKey(), encryptedMessage);

        const map: Map<string, AcceptedField> = JsonUtils.jsonToMap(JSON.parse(result));

        const data: string = (await profileManager.getAuthorizedEncryptionKeys(
            keyPairHelperBob.getPublicKey(), encryptedMessage
        )).get('name') || '';

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

        const baseUserAddr = new bitcore.PrivateKey
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
            baseID: baseID,
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
        const msg: AddrRecord = BaseEthUtils.createEthAddrRecord(
            '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
        );
        WalletUtils.verifyAddressRecord(msg).should.be.equal(WalletVerificationCodes.RC_OK);
    });

    it('verify ETH address record by BASE interface', () => {
        /*
        here is the exact string for message - pay attention to " " and "\n"
        "{\n  \"baseID\": \"02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41\",\n
        \"ethAddr\": \"0x42cb8ae103896daee71ebb5dca5367f16727164a\"\n}"
         */
        // b4ea5b297db8f178e15ef0afb6df240f6e56e67d3d3cb4ada162a677d7a36807
        // 0x29F2EF2D5948de8b192Cb67672DD170d4e44D543

        // 0x29F2EF2D5948de8b192Cb67672DD170d4e44D543
        // tslint:disable-next-line:max-line-length
        // '0x7d530570d312f51a739d9f632bd3997721c463113ae2d04d45bf5c56426b98f610775dab' +
        // '97f8e3ea0601089312b5e6e720e29ee514b8e6ff372649a402d5eb1e1b'

        WalletUtils.verifyAddressRecord(
            new AddrRecord(
                JSON.stringify(
                    {
                        baseID: '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
                        ethAddr: '0x42cb8ae103896daee71ebb5dca5367f16727164a'
                    }),
                '0x273f63c3c0da0bde3448a5dc24865cd25e936d6a210f548fdf7fcfd3f8fc2f9' +
                'd5089fd6fc2ce2c778a04a4a464de09d9f781c2f1f42914eb33f168c3f8e5e2351c'
            )
        ).should.be.equal(WalletVerificationCodes.RC_OK);

        WalletUtils.verifyAddressRecord(
            new AddrRecord(
                JSON.stringify(
                    {
                        _baseID: '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
                        ethAddr: '0x42cb8ae103896daee71ebb5dca5367f16727164a'
                    }),
                // tslint:disable-next-line:max-line-length
                '0x273f63c3c0da0bde3448a5dc24865cd25e936d6a210f548fdf7fcfd3f8fc2f9d5089fd6fc2ce2c778a04a4a464de09d9f781c2f1f42914eb33f168c3f8e5e2351c'
            )
        ).should.be.not.equal(WalletVerificationCodes.RC_OK);

        WalletUtils.verifyAddressRecord(
            new AddrRecord(
                JSON.stringify(
                    {
                        baseID: '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
                        ethAddr: '0x42cb8ae103896daee71ebb5dca5367f16727164a'
                    }),
                // tslint:disable-next-line:max-line-length
                '0x373f63c3c0da0bde3448a5dc24865cd25e936d6a210f548fdf7fcfd3f8fc2f9d5089fd6fc2ce2c778a04a4a464de09d9f781c2f1f42914eb33f168c3f8e5e2351c'
            )
        ).should.be.not.equal(WalletVerificationCodes.RC_OK);
    });

    it('create ETH Wallets record by BASE interface', async () => {
        let msg;
        let rc;
        let ethAddrRecord: AddrRecord;

        const baseUser: RemoteKeyPairHelper = await KeyPairFactory.createRpcKeyPair(rpcTransport);
        const baseUserAccessToken: string = await authenticatorHelper.generateAccessToken(
            'mnemonic for BASE user for testing'
        );

        baseUser.setAccessToken(baseUserAccessToken);
        await baseUser.createKeyPair('');

        baseUser.getPublicKey().should.be.equal('03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996');

        msg = await BaseEthUtils.createEthWalletsRecordWithSigner(
            '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
            [
                WalletUtils.createEthereumAddersRecord(
                    '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
                    '0x42cb8ae103896daee71ebb5dca5367f16727164a',
                    '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
                ),
                WalletUtils.createEthereumAddersRecord(
                    '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
                    '0x50575b106b1f96359f5e5dbe4c270443e6185f1f',
                    '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369002'
                )
            ],
            '17e326f9ebad9ee205ade59c23d3a2d49f87b587f20b1667ee089abe5eb9453b'
        );

        rc = WalletUtils.validateWallets(WalletManagerImpl.DATA_KEY_ETH_WALLETS, msg, baseUser.getPublicKey());
        JSON.stringify(rc).should.be.equal(JSON.stringify(
            {
                rc: WalletVerificationCodes.RC_OK,
                err: '',
                details: [
                    WalletVerificationCodes.RC_OK,
                    WalletVerificationCodes.RC_OK
                ]
            }));

        msg = await BaseEthUtils.createEthWalletsRecordDebug(
            '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
            [
                WalletUtils.createEthereumAddersRecord(
                    '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
                    '0x42cb8ae103896daee71ebb5dca5367f16727164a',
                    '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
                ),
                WalletUtils.createEthereumAddersRecord(
                    '12ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                    '0x50575b106b1f96359f5e5dbe4c270443e6185f1f',
                    '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369002'
                )
            ],
            '17e326f9ebad9ee205ade59c23d3a2d49f87b587f20b1667ee089abe5eb9453b'
        );

        rc = WalletUtils.validateWallets(WalletManagerImpl.DATA_KEY_ETH_WALLETS, msg, baseUser.getPublicKey());
        JSON.stringify(rc).should.be.equal(JSON.stringify(
            {
                rc: WalletVerificationCodes.RC_OK,
                err: '',
                details: [
                    WalletVerificationCodes.RC_OK,
                    WalletVerificationCodes.RC_BASEID_MISSMATCH
                ]
            }));

        rc = WalletUtils.validateWallets('error_eth_wallets', msg, baseUser.getPublicKey());
        rc.rc.should.be.equal(WalletVerificationCodes.RC_GENERAL_ERROR);

        ethAddrRecord = WalletUtils.createEthereumAddersRecord(
            '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
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

        ethAddrRecord = WalletUtils.createEthereumAddersRecord(
            '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996',
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
        );

        const walletsRecords: WalletsRecords = await walletManager.createWalletsRecords(
            [ethAddrRecord],
            '03d1f34ede44ba714316fe3d8c59df1735a4405ce7260d65373ed3cc754fd4f996'
        );
        walletsRecords.data.length.should.be.equal(1);
    });
});
