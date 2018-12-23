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

class ServiceInfo {
    public static SUBSCRIPTION_PROCESSING: string = 'processing';
    public static SUBSCRIPTION_DENY: string = 'deny';
    public type: string;
    public id: string;
    public description: string;
    public requiredKeys: Array<string>;

    constructor(type: string, id: string, description: string, requiredKeys: Array<string>) {
        this.type = type;
        this.id = id;
        this.description = description;
        this.requiredKeys = requiredKeys;
    }
}

export {
    Service,
    ServiceInfo
};