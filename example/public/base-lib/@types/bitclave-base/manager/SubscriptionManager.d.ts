import { Service, ServiceInfo } from '../repository/service/Service';
export interface SubscriptionManager {
    setNameServiceId(id: string): void;
    getServiceProviders(serviceType: string): Promise<Array<string>>;
    getServiceInfo(spid: string): Promise<ServiceInfo>;
    subscribe(serviceInfo: ServiceInfo): Promise<boolean>;
    announceService(service: Service): Promise<boolean>;
    getProcessedData(spid: string): Promise<string>;
    getSubscriptions(): Promise<Map<string, ServiceInfo>>;
}
