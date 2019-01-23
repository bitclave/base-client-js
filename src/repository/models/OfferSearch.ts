export default class OfferSearch {

    id: number = 0;
    searchRequestId: number = 0;
    offerId: number = 0;
    state: OfferResultAction = OfferResultAction.NONE;
    lastUpdated: string;
    info: string;
    events: Array<string>;

    constructor(
        searchRequestId: number = 0,
        offerId: number = 0,
        events: Array<string> = new Array<string>()
    ) {
        this.searchRequestId = searchRequestId;
        this.offerId = offerId;
        this.lastUpdated = Date().toString();
        this.info = 'from base-client-demo';
        this.events = events;

        this.events.push('string1');
        this.events.push('string2');
    }

    public toJson() {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
    
        return json;
    }
}

export enum OfferResultAction {

    NONE = 'NONE',
    ACCEPT = 'ACCEPT',
    REJECT = 'REJECT'

}
