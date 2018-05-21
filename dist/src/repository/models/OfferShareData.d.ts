export default class OfferShareData {
    offerSearchId: number;
    offerOwner: string;
    clientId: string;
    clientResponse: string;
    worth: string;
    accepted: boolean;
    constructor(offerSearchId: number, clientResponse: string);
}
