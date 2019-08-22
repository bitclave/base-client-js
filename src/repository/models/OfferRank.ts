import { DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';

export class OfferRank extends DeepCopy<OfferRank> {

    public readonly id: number;

    public static fromJson(jsonObj: object) {
        const json = jsonObj as JsonObject<OfferRank>;

        json.createdAt = new Date((json.createdAt as string) || new Date());
        json.updatedAt = new Date((json.updatedAt as string) || new Date());
        json.id = Number(json.id);
        json.rank = Number(json.rank);
        json.offerId = Number(json.offerId);

        return Object.assign(new OfferRank(), json);
    }

    constructor(
        public readonly rank: number = 0,
        public readonly offerId: number = 0,
        public readonly rankerId: string = '0x0',
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date()
    ) {
        super(OfferRank);
        this.id = 0;
        this.rank = rank || 0;
        this.offerId = offerId || 0;
        this.rankerId = rankerId || '0x0';
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
