export default class OfferShareData {
    offerId: number;
    clientId: string;
    offerOwner: string;
    clientResponse: string;
    worth: string;
    accepted: boolean;
    constructor(offerId: number, clientId: string, clientResponse: string);
}
