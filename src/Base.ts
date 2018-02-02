import HttpTransportImpl from './repository/source/http/HttpTransportImpl';
import {HttpTransport} from './repository/source/http/HttpTransport';
import AuthImpl from './repository/auth/AuthImpl';
import {Auth} from './repository/auth/Auth';
import ClientDataImpl from './repository/client/ClientDataImpl';
import {ClientData} from './repository/client/ClientData';
import Wallet from './repository/wallet/Wallet';
import AccountManager from './manager/AccountManager';
import LocalStorageImpl from './repository/source/storage/LocalStorageImpl';

export default class Base {

    private _wallet: Wallet;
    private _accountManager: AccountManager;

    constructor(host: string) {
        const transport: HttpTransport = new HttpTransportImpl(host);
        const auth: Auth = new AuthImpl(transport, new LocalStorageImpl());
        const clientData: ClientData = new ClientDataImpl(transport);

        this._wallet = new Wallet();
        this._accountManager = new AccountManager(auth, clientData);
    }

    get wallet(): Wallet {
        return this._wallet;
    }

    get accountManager(): AccountManager {
        return this._accountManager;
    }

}
