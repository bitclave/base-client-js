import { ClassCreator, DeepCopy } from './DeepCopy';
export declare class OfferInteraction extends DeepCopy<OfferInteraction> {
    readonly id: number;
    readonly owner: string;
    readonly offerId: number;
    readonly state: OfferResultAction;
    readonly info: string;
    readonly events: Array<string>;
    createdAt: Date;
    updatedAt: Date;
    static fromJson(json: object): OfferInteraction;
    constructor(offerId?: number, events?: Array<string>);
    toJson(): object;
    protected deepCopyFromJson(): OfferInteraction;
    protected getClass(): ClassCreator<OfferInteraction>;
}
export declare enum OfferResultAction {
    NONE = "NONE",
    ACCEPT = "ACCEPT",
    REJECT = "REJECT",
    EVALUATE = "EVALUATE",
    CONFIRMED = "CONFIRMED",
    REWARDED = "REWARDED",
    COMPLAIN = "COMPLAIN",
    CLAIMPURCHASE = "CLAIMPURCHASE"
}
