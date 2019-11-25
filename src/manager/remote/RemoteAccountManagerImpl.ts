import { BehaviorSubject, Observable } from 'rxjs';
import Account from '../../repository/models/Account';
import { AccessTokenInterceptor } from '../../repository/source/rpc/AccessTokenInterceptor';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { TokenType } from '../../utils/keypair/rpc/RpcToken';
import { AccountManager } from '../AccountManager';

export class RemoteAccountManagerImpl implements AccountManager {

    constructor(
        private readonly transport: RpcTransport,
        private readonly tokenInterceptor: AccessTokenInterceptor,
        private readonly  authAccountBehavior: BehaviorSubject<Account>
    ) {
    }

    public async authenticationByAccessToken(
        accessToken: string,
        tokenType: TokenType,
        message: string
    ): Promise<Account> {
        this.tokenInterceptor.setAccessData(accessToken, tokenType);
        const account = await this.transport.request<Account>(
            'authenticationByAccessToken',
            [tokenType, message],
            Account
        );
        this.authAccountBehavior.next(account);

        return account;
    }

    public authenticationByPassPhrase(passPhrase: string, message: string): Promise<Account> {
        throw new Error('Remote account manager does not support pass-phrase authentication');
    }

    public checkAccount(mnemonicPhrase: string, message: string): Promise<Account> {
        return this.transport.request('checkAccount', [mnemonicPhrase, message], Account);
    }

    public getAccount(): Account {
        return this.authAccountBehavior.getValue();
    }

    public getNewMnemonic(): Promise<string> {
        return this.transport.request('getNewMnemonic', []);
    }

    public getPublicKeyFromMnemonic(mnemonicPhrase: string): Promise<string> {
        return this.transport.request('getPublicKeyFromMnemonic', [mnemonicPhrase]);
    }

    public registration(mnemonicPhrase: string, message: string): Promise<Account> {
        throw new Error('Remote account manager does not support pass-phrase registration');
    }

    public subscribeAccount(): Observable<Account> {
        return this.authAccountBehavior.asObservable();
    }

    public unsubscribe(): Promise<void> {
        return this.transport.request('unsubscribe', [this.authAccountBehavior.getValue()]);
    }
}
