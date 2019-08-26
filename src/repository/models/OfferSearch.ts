import { DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';

export class OfferSearch extends DeepCopy<OfferSearch> {

    public readonly id: number = 0;
    public readonly owner: string = '0x0';
    public readonly searchRequestId: number = 0;
    public readonly offerId: number = 0;
    public readonly createdAt: Date = new Date();

    public static fromJson(json: object): OfferSearch {
        const jsonObj = json as JsonObject<OfferSearch>;
        jsonObj.createdAt = new Date((jsonObj.createdAt as string) || new Date().getTime());

        return Object.assign(new OfferSearch(), jsonObj);
    }

    constructor(searchRequestId: number = 0, offerId: number = 0) {
        super(OfferSearch);
        this.searchRequestId = searchRequestId || 0;
        this.offerId = offerId || 0;
        this.createdAt = new Date();
    }

    public toJson(): object {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json.createdAt = this.createdAt.toJSON();

        return json;
    }

    protected deepCopyFromJson(): OfferSearch {
        return OfferSearch.fromJson(this.toJson());
    }
}
