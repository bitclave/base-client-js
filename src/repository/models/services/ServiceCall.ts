export enum ServiceCallType {
    HTTP = 'HTTP',
    RPC = 'RPC',
    UNDEFINED = 'UNDEFINED'
}

export interface ServiceCall {
    serviceId: string;
    type: ServiceCallType;

    toJson(): object;
}
