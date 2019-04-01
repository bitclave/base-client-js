export default class OfferShareData {
    public readonly offerSearchId: number = 0;
    public offerOwner: string = '0x0';
    public clientId: string = '0x0';
    public readonly clientResponse: string = '';
    public worth: string = '0';
    public accepted: boolean = false;
    public readonly priceId: number;

    constructor(offerSearchId: number, clientResponse: string, priceId: number) {
        this.offerSearchId = offerSearchId;
        this.clientResponse = clientResponse;
        this.priceId = priceId;
    }

}
