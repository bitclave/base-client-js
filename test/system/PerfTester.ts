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
        await user.accountManager.authenticationByPassPhrase(pass, someSigMessage);
        await user.accountManager.unsubscribe();
    } catch (e) {
        console.log('check createUser', e);
        //ignore error if user not exist
    }

    return await user.accountManager.registration(pass, someSigMessage); // this method private.
}

describe('read/write personal data profiling', async () => {
    const passPhraseAlisa: string = 'Alice';    
    const baseAlice: Base = createBase();
    var accAlice: Account;
    var userData;

    const profiler = require('v8-profiler');
    const fs = require('fs');
    const id = Date.now() + ".cpuprofile";

    function createBase(): Base {
        return new Base(
            // 'http://localhost:8080',
            'https://base2-bitclva-com.herokuapp.com',
            'localhost',
            RepositoryStrategyType.Postgres,
            ''
        );
    };

    before(async () => {
        userData = new Map(
            [
                ['key1', 'val1'],
                ['key2', 'val2'],
                ['key3', 'val3'],
                ['key4', 'val4'],
                ['key5', 'val5']
            ]
            );
        accAlice = await createUser(baseAlice, passPhraseAlisa);

        // start profiling
        profiler.startProfiling(id);
        
    });

    beforeEach(async () => {
        
    });

    after(async () => {
        // rpcClient.disconnect();
        const profile = JSON.stringify(profiler.stopProfiling(id))
        fs.writeFile(`./${id}`, profile, () => {
            console.log("profiling done, written to:", id)
        });
    });

    /**/
    it('store personal data', async () => {

        // create wallets for Alice
        await baseAlice.profileManager.updateData(userData);
    });

    it('read personal data', async () => {
        const savedDecrypted = await baseAlice.profileManager.getData();
        savedDecrypted.should.be.deep.equal(userData);

    });
});
