export default class OfferShareData {
    offerId: number = 0;
    clientId: string = '0x0';
    offerOwner: string = '0x0';
    clientResponse: string = '';
    worth: string = '0';
    accepted: boolean = false;

    constructor(offerId: number, clientId: string, clientResponse: string) {
        this.offerId = offerId;
        this.clientId = clientId;
        this.clientResponse = clientResponse;
    }

}
