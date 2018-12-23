import { Observable } from 'rxjs/Observable';
import Account from '../repository/models/Account';
import { Service, ServiceInfo } from '../repository/service/Service';
import { SubscriptionManager } from './SubscriptionManager';
import { ProfileManager } from './ProfileManager';
import { DataRequestManager } from './DataRequestManager';
import DataRequest from '../repository/models/DataRequest';
import { AccessRight } from '../utils/keypair/Permissions';
import ServiceType from '../repository/service/ServiceType';
import SubscriptionPointer from '../repository/service/SubscriptionPointer';

export class SubscriptionManagerImpl implements SubscriptionManager {

    public static KEY_SERVICE_INFO: string = 'service';
    public static KEY_SUBSCRIPTION: string = 'subscription';

    private nameServiceId: string;
    private account: Account = new Account();
    private profileManager: ProfileManager;
    private dataRequestManager: DataRequestManager;

    constructor(
        profileManager: ProfileManager,
        dataRequestManager: DataRequestManager,
        authAccountBehavior: Observable<Account>) {
        this.nameServiceId = '';
        this.profileManager = profileManager;
        this.dataRequestManager = dataRequestManager;

        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }

    /**
     * 
     * @param id public id of the service provider that provides the
     * name service.
     */
    // TODO: need a better way to set up name service's id
    public setNameServiceId(id: string): void {
        this.nameServiceId = id;
    }

    /**
     * Query the name service to look up a list of service providers
     * that have the given types.
     * @param serviceType 
     */
    public getServiceProviders(serviceType: string): Promise<Array<string>> {
        if (this.nameServiceId.length === 0) {
            return new Promise<Array<string>>((resolve, reject) => {
                resolve(new Array());
            });
        }
        // TODO: Since we are using global service type, have a check of the serviceType here.
        return this.dataRequestManager.getRequestedPermissions(this.nameServiceId).then((keys) => {
            // Get all the previously requested keys
            if (keys.indexOf(serviceType) === -1) {
                keys.push(serviceType);
            }
            return this.dataRequestManager.requestPermissions(this.nameServiceId, keys).then(() => {
                return new Promise<Array<string>>((resolve, reject) => {
                    let timer = setInterval(
                        async () => {
                            const res: Map<string, string> = await this.checkRequestStatus(
                                this.account.publicKey,
                                this.nameServiceId,
                                serviceType);
                            const data: string | undefined = res.get(serviceType);
                            if (data !== undefined) {
                                const types: ServiceType = JSON.parse(data);
                                resolve(types.spids);
                                clearTimeout(timer);
                            }
                        },
                        10000);
                });
            });
        });
    }

    /**
     * Retrieve the service info of the given service provider.
     * @param spid 
     */
    public getServiceInfo(spid: string): Promise<ServiceInfo> {
        return this.dataRequestManager.getRequestedPermissions(spid).then((keys) => {
            // Get all the previously requested keys
            if (keys.indexOf(SubscriptionManagerImpl.KEY_SERVICE_INFO) === -1) {
                keys.push(SubscriptionManagerImpl.KEY_SERVICE_INFO);
            }
            return this.dataRequestManager.requestPermissions(spid, keys).then(() => {
                // Pool the request status
                return new Promise<ServiceInfo>((resolve, reject) => {
                    let timer = setInterval(
                        async () => {
                            const res: Map<string, string> = await this.checkRequestStatus(
                                this.account.publicKey,
                                spid,
                                SubscriptionManagerImpl.KEY_SERVICE_INFO);
                            const data: string | undefined = res.get(SubscriptionManagerImpl.KEY_SERVICE_INFO);
                            if (data !== undefined) {
                                const serviceInfo: ServiceInfo = JSON.parse(data);
                                resolve(serviceInfo);
                                clearTimeout(timer);
                            }
                        },
                        10000);
                });
            });
        });
    }

    /**
     * Subscribe to the given service provider
     * @param serviceInfo 
     */
    public subscribe(serviceInfo: ServiceInfo): Promise<boolean> {
        // Send subscription request to service provider by grant all
        // the required data entries
        return this.profileManager.getData().then((data) => {
            return new Promise<boolean>((resolve, reject) => {
                const grantFields: Map<string, AccessRight> = new Map();
                for (let i = 0; i < serviceInfo.requiredKeys.length; ++i) {
                    const key: string = serviceInfo.requiredKeys[i];
                    if (!data.has(key)) {
                        return resolve(false);
                    }
                    grantFields.set(key, AccessRight.R);
                }
                // Get all previously granted permissions
                this.dataRequestManager.getGrantedPermissionsToMe(serviceInfo.id).then((keys) => {
                    for (let i = 0; i < keys.length; ++i) {
                        // TODO: getGrantedPermissionsToMe only returns a list of entries
                        // that have been granted to the client, but we do not know the
                        // corresponding AccessRight
                        grantFields.set(keys[i], AccessRight.R);
                    }
                    this.dataRequestManager.grantAccessForClient(serviceInfo.id, grantFields).then(() => {
                        return resolve(true);
                    });
                });

            });
        }).then((valid) => {
            return new Promise<boolean>((resolve, reject) => {
                if (!valid) {
                    return resolve(false);
                } else {
                    let timer = setInterval(
                        async () => {
                            const res: Map<string, string> = await this.checkRequestStatus(
                                this.account.publicKey,
                                serviceInfo.id,
                                this.account.publicKey);

                            const data: string | undefined = res.get(this.account.publicKey);
                            if (data !== undefined) {
                                // Get subscription status
                                if (data === ServiceInfo.SUBSCRIPTION_DENY) {
                                    resolve(false);
                                    clearTimeout(timer);
                                } else {
                                    // Add a pointer into own storage
                                    const updates: Map<string, string> = new Map();
                                    // Add service provider pointer into own storage
                                    updates.set(
                                        serviceInfo.type,
                                        JSON.stringify(new SubscriptionPointer(serviceInfo.id, serviceInfo.type)));
                                    await this.profileManager.updateData(updates);
                                    resolve(true);
                                    clearTimeout(timer);
                                }
                            }
                        },
                        10000);
                }
            });
        });
    }

    /**
     * Announce the service. If an id of the name service is provided, then
     * the service will be added to that name service.
     * @param service 
     */
    public announceService(service: Service): Promise<boolean> {
        // Add a "service" entry into the storage
        const update: Map<string, string> = new Map();
        update.set(SubscriptionManagerImpl.KEY_SERVICE_INFO, service.toJsonString());
        return this.profileManager.updateData(update).then(() => {
            return new Promise<boolean>((resolve, reject) => {
                // Register it with the name service if presents
                if (this.nameServiceId.length > 0) {
                    this.getServiceInfo(this.nameServiceId).then((serviceInfo) => {
                        this.subscribe(serviceInfo).then((res) => {
                            resolve(res);
                        });
                    });
                } else {
                    resolve(true);
                }
            });
        });

    }

    /**
     * Get the latest data from the service provider
     * @param spid 
     */
    public getProcessedData(spid: string): Promise<string> {
        // Check the data entry pointer shared back by this service provider
        return this.dataRequestManager.getRequests(this.account.publicKey, spid).then((dataRequests) => {
            return this.checkRequestStatus(this.account.publicKey, spid, this.account.publicKey);
        }).then((data) => {
            return new Promise<string>((resolve, reject) => {
                if (data.size > 0) {
                    resolve(data.get(this.account.publicKey));
                } else {
                    resolve('');
                }
            });
        });
    }

    public getSubscriptions(): Promise<Map<string, ServiceInfo>> {
        // TODO: The only way to implement this function at the current design
        // seems like to be scan a list of service types of the clients?
        return new Promise<Map<string, ServiceInfo>>((resolve, reject) => {
            resolve(new Map());
        });
    }
    /**
     * Private helper function to check whether the data request is fulfilled
     * @param from 
     * @param to 
     * @param key 
     */
    private async checkRequestStatus(from: string, to: string, key: string): Promise<Map<string, string>> {
        let result: Map<string, string> = new Map();
        const dataRequests: Array<DataRequest> = await this.dataRequestManager.getRequests(from, to);
        // Check if the requested data entry with the given key has been granted.
        for (let i = 0; i < dataRequests.length; ++i) {
            const request: DataRequest = dataRequests[i];
            // If this request has been granted
            if (request.responseData.length === 0) {
                continue;
            }
            const data: Map<string, string> = await this.profileManager.getAuthorizedData(request.toPk, request.responseData);
            const entry: string | undefined = data.get(key);
            if (entry !== undefined) {
                result.set(key, entry);
                break;
            }
        }
        return result;
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }

}
