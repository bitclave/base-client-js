import { ManagersModule } from './Base';
import { RepositoryStrategyType } from './repository/RepositoryStrategyType';
import { Logger } from './utils/BasicLogger';
export declare class ManagersModuleFactory {
    static createInsideManagers(nodeEndPoint: string, siteOrigin: string, strategy?: RepositoryStrategyType, loggerService?: Logger): ManagersModule;
    static createInsideManagersWithRemoteSigner(nodeEndPoint: string, signerEndPoint: string, siteOrigin: string, strategy?: RepositoryStrategyType, loggerService?: Logger): ManagersModule;
    static createRemoteManagers(remoteManagersEndPoint: string, loggerService?: Logger): ManagersModule;
}
