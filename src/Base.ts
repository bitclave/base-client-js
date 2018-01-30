import Wallet from './repository/wallet/Wallet';
import HttpTransportImpl from './repository/source/HttpTransportImpl';
import AuthImpl from './repository/auth/AuthImpl';
import {Auth} from './repository/auth/Auth';
import AccountManager from './manager/AccountManager';
import ClientDataImpl from './repository/client/ClientDataImpl';
import {ClientData} from './repository/client/ClientData';
import {HttpTransport} from './repository/source/HttpTransport';

export default class Base {

    wallet: Wallet = new Wallet();
    account: AccountManager;

    constructor(host: string) {
        const transport: HttpTransport = new HttpTransportImpl(host);
        const auth: Auth = new AuthImpl(transport);
        const clientData: ClientData = new ClientDataImpl(transport);

        this.account = new AccountManager(auth, clientData);
    }

}
