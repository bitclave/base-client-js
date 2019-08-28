import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';

export class OfferInteraction extends DeepCopy<OfferInteraction> {

    public readonly id: number = 0;
    public readonly owner: string = '0x0';
    public readonly offerId: number = 0;
    public readonly state: OfferResultAction = OfferResultAction.NONE;
    public readonly info: string;
    public readonly events: Array<string>;
    public createdAt: Date = new Date();
    public updatedAt: Date = new Date();

    public static fromJson(json: object): OfferInteraction {
        const jsonObj = json as JsonObject<OfferInteraction>;
        jsonObj.createdAt = new Date((jsonObj.createdAt as string) || new Date().getTime());
        jsonObj.updatedAt = new Date((jsonObj.updatedAt as string) || new Date().getTime());

        return Object.assign(new OfferInteraction(), jsonObj);
    }

    constructor(offerId: number = 0, events: Array<string> = []) {
        super();
        this.offerId = offerId || 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.info = 'from base-client-demo';
        this.events = events || [];
    }

    public toJson(): object {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json.createdAt = this.createdAt.toJSON();
        json.updatedAt = this.updatedAt.toJSON();

        return json;
    }

    protected deepCopyFromJson(): OfferInteraction {
        return OfferInteraction.fromJson(this.toJson());
    }

    protected getClass(): ClassCreator<OfferInteraction> {
        return OfferInteraction;
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
