export default class OfferShareData {
    offerSearchId: number;
    offerOwner: string;
    clientId: string;
    clientResponse: string;
    worth: string;
    accepted: boolean;
    priceId: number;
    constructor(offerSearchId: number, clientResponse: string, priceId: number);
}
