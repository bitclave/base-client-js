export class OfferRank {
    public id: number;
    public rank: number;
    public offerId: number;
    public rankerId: string;
    public createdAt?: Date;
    public updatedAt?: Date;

    // tslint:disable-next-line: no-any
    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id;
            this.rank = obj.rank;
            this.offerId = obj.offerId;
            this.rankerId = obj.rankerId;

            this.createdAt = obj.createdAt;
            this.updatedAt = obj.updatedAt;
        }
    }
}
