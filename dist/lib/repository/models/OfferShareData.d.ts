import { ClassCreator, DeepCopy } from './DeepCopy';
export default class OfferShareData extends DeepCopy<OfferShareData> {
    readonly offerSearchId: number;
    offerOwner: string;
    clientId: string;
    readonly clientResponse: string;
    worth: string;
    accepted: boolean;
    readonly priceId: number;
    constructor(offerSearchId?: number, clientResponse?: string, priceId?: number);
    toJson(): object;
    protected getClass(): ClassCreator<OfferShareData>;
}
