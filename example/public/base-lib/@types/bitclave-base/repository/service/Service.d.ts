/**
 * Service object encapsulates the ServiceInfo object and
 * methods to manage the subscribers
 */
interface Service {
    toJsonString(): string;
    addSubscriber(uid: string): void;
    removeSubscriber(uid: string): void;
    updateData(uid: string, data: string): void;
}
declare class ServiceInfo {
    static SUBSCRIPTION_PROCESSING: string;
    static SUBSCRIPTION_DENY: string;
    type: string;
    id: string;
    description: string;
    requiredKeys: Array<string>;
    constructor(type: string, id: string, description: string, requiredKeys: Array<string>);
}
export { Service, ServiceInfo };
