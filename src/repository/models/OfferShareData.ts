import { ClassCreator, DeepCopy } from './DeepCopy';

export default class OfferShareData extends DeepCopy<OfferShareData> {

    public readonly offerSearchId: number = 0;
    public offerOwner: string = '0x0';
    public clientId: string = '0x0';
    public readonly clientResponse: string = '';
    public worth: string = '0';
    public accepted: boolean = false;
    public readonly priceId: number;

    constructor(offerSearchId: number = 0, clientResponse: string = '', priceId: number = 0) {
        super();
        this.offerSearchId = offerSearchId;
        this.clientResponse = clientResponse;
        this.priceId = priceId;
    }

    public toJson(): object {
        return this;
    }

    protected getClass(): ClassCreator<OfferShareData> {
        return OfferShareData;
    }
}
