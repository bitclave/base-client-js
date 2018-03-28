import KeyPairFactory from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { BehaviorSubject } from 'rxjs/Rx';
import Account from '../../src/repository/models/Account';
import ProfileManager from '../../src/manager/ProfileManager';
import ClientDataRepositoryImplMock from './ClientDataRepositoryImplMock';
import CryptoUtils from '../../src/utils/CryptoUtils';
import JsonUtils from '../../src/utils/JsonUtils';

import { MessageSigner } from '../../src/utils/keypair/MessageSigner';
import { MessageDecrypt } from '../../src/utils/keypair/MessageDecrypt';
import BitKeyPair from "../../src/utils/keypair/BitKeyPair";
import baseEthUitls, {EthWalletVerificationCodes, EthWalletVerificationStatus} from '../../src/utils/BaseEthUtils';

const Message = require('bitcore-message');
const bitcore = require('bitcore-lib');

const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Profile Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
    const keyPairHelperBob: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
    const clientRepository: ClientDataRepositoryImplMock = new ClientDataRepositoryImplMock();

    keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
    keyPairHelperBob.createKeyPair(passPhraseBob);

    const accountAlisa: Account = new Account(keyPairHelperAlisa.createKeyPair(passPhraseAlisa).publicKey);
    const authAccountBehaviorAlisa: BehaviorSubject<Account> = new BehaviorSubject<Account>(accountAlisa);

    const profileManager = new ProfileManager(
            clientRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
    );

    beforeEach(function (done) {
        clientRepository.clearData();
        done();
    });

    it('get and decrypt encrypted data', async () => {
        const origMockData: Map<string, string> = new Map();
        const mockData: Map<string, string> = new Map();

        origMockData.set('name', 'my name');
        origMockData.forEach((value, key) => {
            const passForValue = keyPairHelperAlisa.generatePasswordForField(key);
            mockData.set(key, CryptoUtils.encryptAes256(value, passForValue));
        });

        clientRepository.setMockData(authAccountBehaviorAlisa.getValue().publicKey, mockData);

        const data = await profileManager.getData();

        data.should.be.deep.equal(origMockData);
    });

    it('update data and validate updated data', async () => {
        const origMockData: Map<string, string> = new Map();
        const mockData: Map<string, string> = new Map();

        origMockData.set('email', 'im@host.com');
        origMockData.forEach((value, key) => {
            const passForValue = keyPairHelperAlisa.generatePasswordForField(key);
            mockData.set(key, CryptoUtils.encryptAes256(value, passForValue));
        });

        const data = await profileManager.updateData(origMockData);
        const savedData = await profileManager.getRawData(authAccountBehaviorAlisa.getValue().publicKey);
        const savedDecrypted = await profileManager.getData();

        data.should.be.not.deep.equal(mockData); // different IV every encryption. should be different value
        savedData.should.be.deep.equal(data);
        savedDecrypted.should.be.deep.equal(origMockData);
    });

    it('should decrypt foreign data', async () => {
        const origMockData: Map<string, string> = new Map();
        const mockData: Map<string, string> = new Map();
        const originMessage: Map<string, string> = new Map();

        origMockData.set('name', 'Bob');
        origMockData.forEach((value, key) => {
            const passForValue = keyPairHelperBob.generatePasswordForField(key);
            mockData.set(key, CryptoUtils.encryptAes256(value, passForValue));
            originMessage.set(key, passForValue);
        });

        const encryptedMessage = keyPairHelperBob.encryptMessage(
            keyPairHelperAlisa.getPublicKey(),
            JSON.stringify(JsonUtils.mapToJson(originMessage))
        );

        clientRepository.setMockData(keyPairHelperBob.getPublicKey(), mockData);

        const data = await profileManager.getAuthorizedData(keyPairHelperBob.getPublicKey(), encryptedMessage);

        data.should.be.deep.equal(origMockData);
    });

    it('verify schema library test', function () {

        var schema_eth_addr = {
            "type": "object",
            "properties":  {
                "addr" : {
                    "type" : "string"
                },
                "signature": {
                    "type": "string"
                },
            },
            "required": ["addr"],
            "additionalProperties": false
        }

        var schema = {
            "title": "Profile",
            "definitions": {
                "eth_address": schema_eth_addr
            },

            "type": "object",
            "properties": {
                "baseID" : {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "wealth": {
                    "description": "wealth in USD",
                    "type": "string"
                },
                "eth_wallets": {
                    "description": "list of ETH wallets",
                    "type": "array",
                    "items": { "$ref": "#/definitions/eth_address" },
                    "minItems": 1,
                    "uniqueItems" : true
                }
            },
            "required": ["baseID"],
            "additionalProperties": false
        };

        var Ajv = require('ajv');
        var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
        var validate = ajv.compile(schema);
        var baseID = "123456";
        var data1 = {
            "baseID": baseID,
            "email": "mark@bitclave.com",
            "eth_wallets": [
                {"addr": "0xaaa"},
                {"addr": "0xbbb", "signature": "signature"}
            ]
        }
        var data2 = {
            "baseID": baseID,
            "email": "mark@bitclave.com",
            "eth_wallets": [
                {"addr": "0xaaa"},
                {"addr": "0xbbb", "signature1": "signature"}
            ]
        }
        validate(data1).should.be.equal(true);
        validate(data2).should.be.equal(false);

        // var valid = validate(data);
        // if (valid) console.log('Valid!');
        // else console.log('Invalid: ' + ajv.errorsText(validate.errors));


    });


    it('verify ETH address low level', async () => {

        //BASE (BitCoin-like) signature verification
        const keyPairHelper: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
        const messageSigner: MessageSigner = keyPairHelper;

        // create BASE user for tesing
        const baseUser = await keyPairHelper.createKeyPair("mnemonic for BASE user for testing");

        const baseUserAddr = new bitcore.PrivateKey
            .fromString(baseUser.privateKey)
            .toAddress()
            .toString(16);

        var baseID = keyPairHelper.getPublicKey();

        // create ETH keys for testing
            var ethPrvKey1 = '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'
        // the matching addr1 for the above key is 0x42cb8ae103896daee71ebb5dca5367f16727164a
        var ethAddr1 = "0x"+ethUtil.privateToAddress(Buffer.from(ethPrvKey1, 'hex')).toString('hex')

        var ethPrvKey2 = '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369002'
        // the matching addr1 for the above key is 0x50575b106b1f96359f5e5dbe4c270443e6185f1f
        var ethAddr2 = "0x"+ethUtil.privateToAddress(Buffer.from(ethPrvKey2, 'hex')).toString('hex')

        // sign string {baseID, eth_addr1, eth_addr2} with private keys for baseID, eth_addr1, eth_addr2
        var msg = {
            "baseID" : baseID,
            "addr1" : baseID + "_" + ethAddr1,
            "addr2" : baseID + "_" + ethAddr2
        };

        const msgParams1 = { data: msg.addr1, sig: "" };
        const msgParams2 = { data: msg.addr2, sig: "" };

        // sign ETH address1
        msgParams1.sig = sigUtil.personalSign(Buffer.from(ethPrvKey1, 'hex'), msgParams1);
        var pub1 = sigUtil.recoverPersonalSignature(msgParams1);
        pub1.should.be.equal(ethAddr1.toLowerCase());

        var dataForAddr1 = '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41_0x42cb8ae103896daee71ebb5dca5367f16727164a'
        // you can get this signature externally by using https://www.myetherwallet.com/signmsg.html with private key ethPrvKey1 and dataForAddr1
        // or if you import ethPrvKey1 into MetaMask and sign with MetaMask
        var sigForAddr1 = '0xaebc6259855beef413e3022addb06d5113de66dca7b803c4777b9123fa85e63559df2a4bc5e53966f09af308bbf5876c042bf5297b942df81922e3409e89b82b1b'
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
            sig: ""
        }

        finalMsg.sig = await messageSigner.signMessage(JSON.stringify(finalMsg.data));
        Message(JSON.stringify(finalMsg.data)).verify(baseUserAddr, finalMsg.sig).should.be.true;

        // console.log(finalMsg);



    });

    it('create ETH address record by BASE interface', function ()  {
        var msg = baseEthUitls.createEthAddrRecord(
            '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
            '0x42cb8ae103896daee71ebb5dca5367f16727164a',
            '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'

            )
        baseEthUitls.verifyEthAddrRecord(msg).should.be.equal(EthWalletVerificationCodes.RC_OK);
    });

    it('verify ETH address record by BASE interface', function ()  {
        /*
        here is the exact string for message - pay attention to " " and "\n"
        "{\n  \"baseID\": \"02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41\",\n  \"ethAddr\": \"0x42cb8ae103896daee71ebb5dca5367f16727164a\"\n}"
         */
        baseEthUitls.verifyEthAddrRecord(
            {
                "data": JSON.stringify(
                    {
                        baseID: '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                        ethAddr: '0x42cb8ae103896daee71ebb5dca5367f16727164a'
                    }),
                "sig": '0x5b5dfb8f20d10cd3e172eddab49a5a07d10acb0abadd889eb9bc441a35312fc4072dfa8e5dda313abba31c7e697532306061dfc2ee29cce0793d56ba18d975f31c'
            }
        ).should.be.equal(EthWalletVerificationCodes.RC_OK);

        baseEthUitls.verifyEthAddrRecord(
            {
                "data": JSON.stringify(
                    {
                        _baseID: '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                        ethAddr: '0x42cb8ae103896daee71ebb5dca5367f16727164a'
                    }),
                "sig": '0x5b5dfb8f20d10cd3e172eddab49a5a07d10acb0abadd889eb9bc441a35312fc4072dfa8e5dda313abba31c7e697532306061dfc2ee29cce0793d56ba18d975f31c'
            }
        ).should.be.not.equal(EthWalletVerificationCodes.RC_OK);

        baseEthUitls.verifyEthAddrRecord(
            {
                "data": JSON.stringify(
                    {
                        baseID: '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                        ethAddr: '0x42cb8ae103896daee71ebb5dca5367f16727164a'
                    }),
                "sig": '0x6b5dfb8f20d10cd3e172eddab49a5a07d10acb0abadd889eb9bc441a35312fc4072dfa8e5dda313abba31c7e697532306061dfc2ee29cce0793d56ba18d975f31c'
            }
        ).should.be.not.equal(EthWalletVerificationCodes.RC_OK);
    });

    it('create ETH Wallets record by BASE interface', async () => {
        const baseUser = await KeyPairFactory.getDefaultKeyPairCreator().createKeyPair("mnemonic for BASE user for testing");
        baseUser.publicKey.should.be.equal('02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41');

        var msg = await baseEthUitls.createEthWalletsRecord(
            '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
            [
                baseEthUitls.createEthAddrRecord(
                '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                '0x42cb8ae103896daee71ebb5dca5367f16727164a',
                '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'

                ),
                baseEthUitls.createEthAddrRecord(
                    '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                    '0x50575b106b1f96359f5e5dbe4c270443e6185f1f',
                    '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369002'
                )
            ],
            '8ff8fdbfb47add1daf16ea856444ff1c76cc7a5617244acf6c103587e95fdf1e'
        );

        var rc = baseEthUitls.verifyEthWalletsRecord(baseUser.publicKey, msg);
        JSON.stringify(rc).should.be.equal(JSON.stringify(
            {
                rc: EthWalletVerificationCodes.RC_OK,
                err: "",
                details: [
                    EthWalletVerificationCodes.RC_OK,
                    EthWalletVerificationCodes.RC_OK
                ]
            }));

        var msg = await baseEthUitls.dbg_createEthWalletsRecord(
            '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
            [
                baseEthUitls.createEthAddrRecord(
                    '02ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                    '0x42cb8ae103896daee71ebb5dca5367f16727164a',
                    '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369001'

                ),
                baseEthUitls.createEthAddrRecord(
                    '12ce52c58095cf223a3f3f4d3a725b092db11909e5e58bbbca550fb80a2c18ab41',
                    '0x50575b106b1f96359f5e5dbe4c270443e6185f1f',
                    '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c82995744369002'
                )
            ],
            '8ff8fdbfb47add1daf16ea856444ff1c76cc7a5617244acf6c103587e95fdf1e'
        );

        var rc = baseEthUitls.verifyEthWalletsRecord(baseUser.publicKey, msg);
        JSON.stringify(rc).should.be.equal(JSON.stringify(
            {
                rc: EthWalletVerificationCodes.RC_OK,
                err: "",
                details: [
                    EthWalletVerificationCodes.RC_OK,
                    EthWalletVerificationCodes.RC_BASEID_MISSMATCH
                ]
            }));
    });


    // it('verify BTC address', async () => {
    //     var baseID = "aaa";
    //     var eth_addr1 = "bbb";
    //     var eth_addr2 = "ccc";
    //
    //     // sign string {baseID, eth_addr1, eth_addr2} with private keys for baseID, eth_addr1, eth_addr2
    //     var msg = JSON.stringify({
    //         "baseID" : baseID,
    //         "addr1" : eth_addr1,
    //         "addr2" : eth_addr2
    //     });
    //
    //     console.log(msg);
    //
    //     const keyPairHelper: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
    //     const messageSigner: MessageSigner = keyPairHelper;
    //
    //     const keyPairAlisa = await keyPairHelper.createKeyPair(passPhraseAlisa);
    //
    //     const addressAlisa = new bitcore.PrivateKey
    //         .fromString(keyPairAlisa.privateKey)
    //         .toAddress()
    //         .toString(16);
    //
    //     const sig: string = await messageSigner.signMessage(msg);
    //
    //     sig.should.not.equal(passPhraseAlisa);
    //
    //     Message(msg).verify(addressAlisa, sig).should.be.true;
    //
    //     // verify signature based on PUBLIC baseID, eth_addr1, eth_addr2
    //     var ethPubAddr = '0x54dbb737eac5007103e729e9ab7ce64a6850a310';
    //     var ethPrvKey = '52435b1ff11b894da15d87399011841d5edec2de4552fdc29c8299574436924d'
    //
    //     const msgParams = { data: msg, sig: "" };
    //
    //     msgParams.sig = sigUtil.personalSign(Buffer.from(ethPrvKey, 'hex'), msgParams);
    //     var pub = sigUtil.recoverPersonalSignature(msgParams);
    //
    //     console.log(pub);
    //
    //
    //     const bitKeyPair = new BitKeyPair();
    //     bitKeyPair.initKeyPairFromPrvKey(ethPrvKey);
    //
    //     var pubKey = ethUtil.privateToPublic(Buffer.from(ethPrvKey, 'hex')).toString('hex');
    //     console.log("public key by ETH:", pubKey);
    //
    //     console.log(bitKeyPair);
    //
    //     // const sig2 = await bitKeyPair.signMessage(msg);
    //     // Message(msg).verify(addressAlisa, sig2).should.be.true;
    //
    //
    // });
});
