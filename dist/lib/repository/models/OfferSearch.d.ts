import { ClassCreator, DeepCopy } from './DeepCopy';
export declare class OfferSearch extends DeepCopy<OfferSearch> {
    readonly id: number;
    readonly owner: string;
    readonly searchRequestId: number;
    readonly offerId: number;
    readonly createdAt: Date;
    static fromJson(json: object): OfferSearch;
    constructor(searchRequestId?: number, offerId?: number);
    toJson(): object;
    protected deepCopyFromJson(): OfferSearch;
    protected getClass(): ClassCreator<OfferSearch>;
}
