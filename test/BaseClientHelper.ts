import Base, { ManagersModule, ManagersModuleFactory, TokenType, TransportFactory } from '../src/Base';
import AuthenticatorHelper from './AuthenticatorHelper';

const BASE_NODE_URL = process.env.BASE_NODE_URL || 'https://base2-bitclva-com-user.herokuapp.com';
const SIGNER_ULR = process.env.SIGNER || 'http://localhost:3545';
const MANAGERS_URL = process.env.MANAGERS_URL || 'http://localhost:3333';
const MODULE = process.env.BASE_MODULE || 'local'; // 'local/remote/remote-signer'

console.log(`Implement ${MODULE} ManagersModule`);
console.log('BASE_NODE', BASE_NODE_URL);
console.log('SIGNER', SIGNER_ULR);
console.log('MANAGERS', MANAGERS_URL);

export enum MANAGERS_TYPE {
    LOCAL = 'LOCAL',
    REMOTE = 'REMOTE',
}

const getManagersType = (): MANAGERS_TYPE => {
    return (MODULE === 'remote' || MODULE === 'remote-signer') ? MANAGERS_TYPE.REMOTE : MANAGERS_TYPE.LOCAL;
};

const getModule = (): ManagersModule => {
    let module: ManagersModule;

    if (MODULE === 'remote') {
        module = ManagersModuleFactory.createRemoteManagers(MANAGERS_URL);

    } else if (MODULE === 'remote-signer') {
        module = ManagersModuleFactory.createInsideManagersWithRemoteSigner(
            BASE_NODE_URL,
            SIGNER_ULR,
            'localhost'
        );

    } else {
        module = ManagersModuleFactory.createInsideManagers(BASE_NODE_URL, 'localhost');
    }

    return module;
};

export class BaseClientHelper {

    public static readonly AUTH_HELPER =
        new AuthenticatorHelper(TransportFactory.createJsonRpcHttpTransport(SIGNER_ULR));

    private static readonly ACTIVE_MANAGERS = getManagersType();

    public static getBaseNodeUrl(): string {
        return BASE_NODE_URL;
    }

    public static get managerType(): MANAGERS_TYPE {
        return this.ACTIVE_MANAGERS;
    }

    public static async createRegistered(
        pass: string,
        message: string = 'some secret message',
        expireTimeMs: number = AuthenticatorHelper.EXPIRE_TOKEN_HOURS_MS
    ): Promise<Base> {
        const base = BaseClientHelper.createUnRegistered();

        let passOrToken = pass;

        if (this.ACTIVE_MANAGERS === MANAGERS_TYPE.REMOTE) {
            passOrToken = await BaseClientHelper.AUTH_HELPER.generateAccessToken(pass, expireTimeMs);
        }

        try {
            await ((MODULE === 'remote' || MODULE === 'remote-signer')
                   ? base.accountManager.authenticationByAccessToken(passOrToken, TokenType.BASIC, message)
                   : base.accountManager.authenticationByPassPhrase(passOrToken, message));

            await base.accountManager.unsubscribe();
        } catch (e) {
            // ignore
        }

        await ((MODULE === 'remote' || MODULE === 'remote-signer')
               ? base.accountManager.authenticationByAccessToken(passOrToken, TokenType.BASIC, message)
               : base.accountManager.authenticationByPassPhrase(passOrToken, message));

        return base;
    }

    public static createUnRegistered(): Base {
        return new Base(getModule());
    }
}
