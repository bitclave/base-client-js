import { DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';

export class OfferRank extends DeepCopy<OfferRank> {

    public readonly id: number;
    public readonly rank: number;
    public readonly offerId: number;
    public readonly rankerId: number;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    public static fromJson(jsonObj: object) {
        const json = jsonObj as JsonObject<OfferRank>;

        json.createdAt = new Date((json.createdAt as string) || new Date());
        json.updatedAt = new Date((json.updatedAt as string) || new Date());
        json.id = Number(json.id);
        json.rank = Number(json.rank);
        json.offerId = Number(json.offerId);
        json.rankerId = Number(json.rankerId);

        return Object.assign(new OfferRank(), json);
    }

    constructor(
        rank: number = 0,
        offerId: number = 0,
        rankerId: number = 0,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        super();
        this.id = 0;
        this.rank = rank || 0;
        this.offerId = offerId || 0;
        this.rankerId = rankerId || 0;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    public toJson(): object {
        const json = JSON.parse(JSON.stringify(this));
        json.createdAt = this.createdAt.toJSON();
        json.updatedAt = this.updatedAt.toJSON();

        return json;
    }

    protected deepCopyFromJson(): OfferRank {
        return OfferRank.fromJson(this.toJson());
    }
}
