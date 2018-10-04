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

describe('BASE API test: External Validator', async () => {
  const passPhraseAlice: string = 'Alice';
  const passPhraseDesearch: string = 'Desearch';
  const passPhraseValidator: string = 'Validator';

  const baseAlice: Base = createBase();
  const baseDesearch: Base = createBase();
  const baseValidator: Base = createBase();

  var accAlice: Account;
  var accDesearch: Account;
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
      accAlice = await createUser(baseAlice, passPhraseAlice);
      accDesearch = await createUser(baseDesearch, passPhraseDesearch);
      accValidator = await createUser(baseValidator, passPhraseValidator);
  });

  after(async () => {
      // rpcClient.disconnect();
  });

  it('full flow with Alice, Bob, Carol, Desearch and Validator', async () => {
      // to get this records, I used example application, created a wallet records and did copy&paste
      try {
          var wallets = [
              '{"data":[{"data":"{\\"baseID\\":\\"03cb46e31c2d0f5827bb267f9fb30cf98077165d0e560b964651c6c379f69c7a35\\",\\"ethAddr\\":\\"0x916e1c7340f3f0a7af1a5b55e0fd9c3846ef8d28\\"}","sig":"0x08602606d842363d58e714e18f8c4d4b644c0cdc88d644dba03d0af3558f0691334a4db534034ba736347a085f28a58c9b643be25a9c7169f073f69a26b432531b"}],"sig":"IMBBXn+LLf4jWmjhQ1cWGmccuCZW9M5TwQYq46nXpCFUbs72Sxjn0hxOtmyNwiP4va97ZwCruqFyNhi3CuR1BvM="}',
          ];
          var accs = [
              accAlice
          ];

          // create wallets for Alice and grantt access for Validator
          await baseAlice.profileManager.updateData(new Map([[WalletManagerImpl.DATA_KEY_ETH_WALLETS, wallets[0]]]));
          await baseAlice.walletManager.addWealthValidator(accValidator.publicKey);

          // Validator retrieves the requests from Alice,Bob and Carol
          const requestsByFrom: Array<DataRequest> = await baseValidator.dataRequestManager.getRequests(
              accValidator.publicKey, ''
          );

          requestsByFrom.sort((a, b) => a.id > b.id ? 1 : -1);

          // Validator decodes wallets for Alice, Bob and Carol
          const wealthMap: Map<string, string> = new Map<string, string>();
          for (var i = 0; i < requestsByFrom.length; i++) {
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
              const obj: any = {'sig': await baseValidator.profileManager.signMessage(wealth)};
              obj[WalletManagerImpl.DATA_KEY_WEALTH] = wealth;

              wealthMap.set(accs[i].publicKey, JSON.stringify(obj));
          }

          // Validator writes wealth for all users to BASE
          // Validator stores the data in <key, value> map,
          // where key is the public key of the user that asked for verification
          baseValidator.profileManager.updateData(wealthMap);

          const grantFields: Map<string, AccessRight> = new Map();
          // Validator shares wealth records with the original owners of the wallets
          for (var i = 0; i < requestsByFrom.length; i++) {
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

          //Desearch reads wealth record from Alice
          const recordsForDesearch = await baseDesearch.dataRequestManager.getRequests(
              accDesearch.publicKey, accAlice.publicKey
          );
          const wealthOfAlice: Map<string, string> = await baseDesearch.profileManager.getAuthorizedData(
              // accAlice.publicKey, recordsForDesearch[0].responseData);
              recordsForDesearch[0].toPk, recordsForDesearch[0].responseData);
          const wealthRecord: any = wealthOfAlice.get(WalletManagerImpl.DATA_KEY_WEALTH);
          const wealthRecordObject: WealthPtr = JSON.parse(wealthRecord);
          // console.log(wealthRecord);

          // desearch reads Alice's wealth from Validator's storage
          const rawData = await baseDesearch.profileManager.getRawData(wealthRecordObject.validator);
          var encryptedAliceWealth: any = rawData.get(accAlice.publicKey);
          // desearch decodes Alice's wealth
          const decryptedAliceWealth: string = CryptoUtils.decryptAes256(encryptedAliceWealth, wealthRecordObject.decryptKey);
          // console.log("Alice's wealth as is seen by Desearch", decryptedAliceWealth);

          const decryptedAliceWealthObject: WealthRecord = JSON.parse(decryptedAliceWealth);

          // desearch verifies the signature of the wealth record
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