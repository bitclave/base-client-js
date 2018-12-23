/**
 * Object represents the pointer entry stored at clients side
 * after successfully subscribe to a service
 * {type: {spid, schema}}
 */
export default class SubscriptionPointer {
    static SEP: string;
    static SPID: string;
    static UID: string;
    static BID: string;
    spid: string;
    schema: string;
    constructor(spid: string, serviceType: string);
    static conform(value: string): boolean;
}
