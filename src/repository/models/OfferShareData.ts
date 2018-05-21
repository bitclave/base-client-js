export default class OfferShareData {
    offerSearchId: number = 0;
    offerOwner: string = '0x0';
    clientId: string = '0x0';
    clientResponse: string = '';
    worth: string = '0';
    accepted: boolean = false;

    constructor(offerSearchId: number, clientResponse: string) {
        this.offerSearchId = offerSearchId;
        this.clientResponse = clientResponse;
    }

}
