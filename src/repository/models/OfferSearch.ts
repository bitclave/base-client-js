export default class OfferSearch {

    id: number = 0;
    readonly owner: string = '0x0';
    searchRequestId: number = 0;
    offerId: number = 0;
    state: OfferResultAction = OfferResultAction.NONE;
    info: string;
    events: Array<string>;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    public static fromJson(json: any): OfferSearch {
        const offerSearch: OfferSearch = Object.assign(new OfferSearch(), json);
        offerSearch.createdAt = new Date(json.createdAt);
        offerSearch.updatedAt = new Date(json.updatedAt);

        return offerSearch;
    }

    constructor(
        searchRequestId: number = 0,
        offerId: number = 0,
        events: Array<string> = new Array<string>()
    ) {
        this.searchRequestId = searchRequestId;
        this.offerId = offerId;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.info = 'from base-client-demo';
        this.events = events;
    }

    public toJson() {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json.createdAt = this.createdAt.toUTCString();
        json.updatedAt = this.updatedAt.toUTCString();

        return json;
    }
}

export enum OfferResultAction {

    NONE = 'NONE',
    ACCEPT = 'ACCEPT',
    REJECT = 'REJECT'

}
