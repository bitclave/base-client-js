import { BehaviorSubject, Observable } from 'rxjs';
import Account from '../../repository/models/Account';
import { AccessTokenInterceptor } from '../../repository/source/rpc/AccessTokenInterceptor';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { TokenType } from '../../utils/keypair/rpc/RpcToken';
import { AccountManager } from '../AccountManager';
export declare class RemoteAccountManagerImpl implements AccountManager {
    private readonly transport;
    private readonly tokenInterceptor;
    private readonly authAccountBehavior;
    constructor(transport: RpcTransport, tokenInterceptor: AccessTokenInterceptor, authAccountBehavior: BehaviorSubject<Account>);
    authenticationByAccessToken(accessToken: string, tokenType: TokenType, message: string): Promise<Account>;
    authenticationByPassPhrase(passPhrase: string, message: string): Promise<Account>;
    checkAccount(mnemonicPhrase: string, message: string): Promise<Account>;
    getAccount(): Account;
    getNewMnemonic(): Promise<string>;
    getPublicKeyFromMnemonic(mnemonicPhrase: string): Promise<string>;
    registration(mnemonicPhrase: string, message: string): Promise<Account>;
    subscribeAccount(): Observable<Account>;
    unsubscribe(): Promise<void>;
}
