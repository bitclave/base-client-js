import { DeepCopy } from './DeepCopy';

export default class OfferSearch extends DeepCopy<OfferSearch> {

    public readonly id: number = 0;
    public readonly owner: string = '0x0';
    public readonly searchRequestId: number = 0;
    public readonly offerId: number = 0;
    public readonly state: OfferResultAction = OfferResultAction.NONE;
    public readonly info: string;
    public readonly events: Array<string>;
    public createdAt: Date = new Date();
    public updatedAt: Date = new Date();

    public static fromJson(json: object): OfferSearch {
        const offerSearch: OfferSearch = Object.assign(new OfferSearch(), json);
        offerSearch.createdAt = new Date((json as OfferSearch).createdAt);
        offerSearch.updatedAt = new Date((json as OfferSearch).updatedAt);

        return offerSearch;
    }

    constructor(searchRequestId: number = 0, offerId: number = 0, events: Array<string> = []) {
        super(OfferSearch);
        this.searchRequestId = searchRequestId || 0;
        this.offerId = offerId || 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.info = 'from base-client-demo';
        this.events = events || [];
    }

    public toJson() {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json.createdAt = this.createdAt.toJSON();
        json.updatedAt = this.updatedAt.toJSON();

        return json;
    }

    protected deepCopyFromJson(): OfferSearch {
        return OfferSearch.fromJson(this.toJson());
    }
}

export enum OfferResultAction {

    NONE = 'NONE',
    ACCEPT = 'ACCEPT',              // set by ???
    REJECT = 'REJECT',              // set by User when rejects the offer
    EVALUATE = 'EVALUATE',          // set by User when following external redirect link
    CONFIRMED = 'CONFIRMED',        // set by Offer Owner when user completed external action
    REWARDED = 'REWARDED',          // set by Offer Owner when Owner paid out the promised reward
    COMPLAIN = 'COMPLAIN',          // set by User when complains on the offer
    CLAIMPURCHASE = 'CLAIMPURCHASE' // set by User to communicate that he mad the purchase for external offer
}
