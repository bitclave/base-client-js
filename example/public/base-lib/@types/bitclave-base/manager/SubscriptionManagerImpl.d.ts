import { Observable } from 'rxjs/Observable';
import Account from '../repository/models/Account';
import { Service, ServiceInfo } from '../repository/service/Service';
import { SubscriptionManager } from './SubscriptionManager';
import { ProfileManager } from './ProfileManager';
import { DataRequestManager } from './DataRequestManager';
export declare class SubscriptionManagerImpl implements SubscriptionManager {
    static KEY_SERVICE_INFO: string;
    static KEY_SUBSCRIPTION: string;
    private nameServiceId;
    private account;
    private profileManager;
    private dataRequestManager;
    constructor(profileManager: ProfileManager, dataRequestManager: DataRequestManager, authAccountBehavior: Observable<Account>);
    /**
     *
     * @param id public id of the service provider that provides the
     * name service.
     */
    setNameServiceId(id: string): void;
    /**
     * Query the name service to look up a list of service providers
     * that have the given types.
     * @param serviceType
     */
    getServiceProviders(serviceType: string): Promise<Array<string>>;
    /**
     * Retrieve the service info of the given service provider.
     * @param spid
     */
    getServiceInfo(spid: string): Promise<ServiceInfo>;
    /**
     * Subscribe to the given service provider
     * @param serviceInfo
     */
    subscribe(serviceInfo: ServiceInfo): Promise<boolean>;
    /**
     * Announce the service. If an id of the name service is provided, then
     * the service will be added to that name service.
     * @param service
     */
    announceService(service: Service): Promise<boolean>;
    /**
     * Get the latest data from the service provider
     * @param spid
     */
    getProcessedData(spid: string): Promise<string>;
    getSubscriptions(): Promise<Map<string, ServiceInfo>>;
    /**
     * Private helper function to check whether the data request is fulfilled
     * @param from
     * @param to
     * @param key
     */
    private checkRequestStatus;
    private onChangeAccount;
}
