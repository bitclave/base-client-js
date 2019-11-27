import { AccessTokenInterceptor, ManagersModule, TokenType, TransportFactory } from './Base';
import { InternalManagerModule } from './InternalManagerModule';
import { RemoteManagerModule } from './RemoteManagerModule';
import { RepositoryStrategyType } from './repository/RepositoryStrategyType';
import { BasicLogger, Logger } from './utils/BasicLogger';
import { KeyPairFactory } from './utils/keypair/KeyPairFactory';

export class ManagersModuleFactory {

    public static createInsideManagers(
        nodeEndPoint: string,
        siteOrigin: string,
        strategy: RepositoryStrategyType = RepositoryStrategyType.Postgres,
        loggerService?: Logger
    ): ManagersModule {
        return InternalManagerModule
            .Builder(nodeEndPoint, siteOrigin)
            .setStrategyType(strategy)
            .setLoggerService(loggerService || new BasicLogger())
            .build();
    }

    public static createInsideManagersWithRemoteSigner(
        nodeEndPoint: string,
        signerEndPoint: string,
        siteOrigin: string,
        strategy: RepositoryStrategyType = RepositoryStrategyType.Postgres,
        loggerService?: Logger
    ): ManagersModule {

        const tokenAccepter = new AccessTokenInterceptor('', TokenType.BASIC);
        const httpTransport = TransportFactory.createJsonRpcHttpTransport(
            signerEndPoint,
            loggerService || new BasicLogger()
        )
            .addInterceptor(tokenAccepter);

        const keyPair = KeyPairFactory.createRpcKeyPair(httpTransport, tokenAccepter);

        return InternalManagerModule
            .Builder(nodeEndPoint, siteOrigin)
            .setKeyPairHelper(keyPair)
            .setStrategyType(strategy)
            .setLoggerService(loggerService || new BasicLogger())
            .setMessageSigner(keyPair)
            .setMessageEncrypt(keyPair)
            .setMessageDecrypt(keyPair)
            .build();
    }

    public static createRemoteManagers(remoteManagersEndPoint: string, loggerService?: Logger): ManagersModule {
        return new RemoteManagerModule(remoteManagersEndPoint, loggerService);
    }
}
