import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';
export declare class OfferRank extends DeepCopy<OfferRank> {
    readonly rank: number;
    readonly offerId: number;
    readonly rankerId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly id: number;
    static fromJson(jsonObj: object): OfferRank & JsonObject<OfferRank>;
    constructor(rank?: number, offerId?: number, rankerId?: string, createdAt?: Date, updatedAt?: Date);
    toJson(): object;
    protected deepCopyFromJson(): OfferRank;
    protected getClass(): ClassCreator<OfferRank>;
}
