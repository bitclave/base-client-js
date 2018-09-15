export default class OfferSearch {
    id: number;
    searchRequestId: number;
    offerId: number;
    state: OfferResultAction;
    constructor(searchRequestId?: number, offerId?: number);
}
export declare enum OfferResultAction {
    NONE = "NONE",
    ACCEPT = "ACCEPT",
    REJECT = "REJECT"
}
