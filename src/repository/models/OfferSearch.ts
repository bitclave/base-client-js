export default class OfferSearch {

    id: number = 0;
    searchRequestId: number = 0;
    offerId: number = 0;
    state: OfferResultAction = OfferResultAction.NONE;

    constructor(searchRequestId: number = 0,
                offerId: number = 0) {
        this.searchRequestId = searchRequestId;
        this.offerId = offerId;
    }

}

export enum OfferResultAction {

    NONE = 'NONE',
    ACCEPT = 'ACCEPT',
    REJECT = 'REJECT'

}
