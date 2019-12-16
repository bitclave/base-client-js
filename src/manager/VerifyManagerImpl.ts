import Account from '../repository/models/Account';
import { OfferInteraction } from '../repository/models/OfferInteraction';
import { OfferSearch } from '../repository/models/OfferSearch';
import SearchRequest from '../repository/models/SearchRequest';
import { VerifyRepository } from '../repository/verify/VerifyRepository';
import { ExportMethod } from '../utils/ExportMethod';
import { ParamDeserializer } from '../utils/types/json-transform';
import { DateDeserializer } from '../utils/types/json-transform/deserializers/DateDeserializer';
import { VerifyManager } from './VerifyManager';

export class VerifyManagerImpl implements VerifyManager {

    constructor(private readonly verifyRepository: VerifyRepository) {
    }

    @ExportMethod()
    public getOfferSearchesByIds(ids: Array<number>): Promise<Array<OfferSearch>> {
        return this.verifyRepository.getOfferSearchesByIds(ids);
    }

    @ExportMethod()
    public getAccountsByPublicKeys(publicKeys: Array<string>): Promise<Array<Account>> {
        return this.verifyRepository.getAccountsByPublicKeys(publicKeys);
    }

    @ExportMethod()
    public getAllAccounts(@ParamDeserializer(new DateDeserializer()) fromDate: Date): Promise<Array<Account>> {
        return this.verifyRepository.getAllAccounts(fromDate);
    }

    @ExportMethod()
    public getDanglingOfferSearches(type: number): Promise<Array<OfferSearch>> {
        return this.verifyRepository.getDanglingOfferSearches(type);
    }

    @ExportMethod()
    public getDanglingOfferInteractions(): Promise<Array<OfferInteraction>> {
        return this.verifyRepository.getDanglingOfferInteractions();
    }

    @ExportMethod()
    public fixDanglingOfferSearchesByCreatingInteractions(): Promise<Array<OfferInteraction>> {
        return this.verifyRepository.fixDanglingOfferSearchesByCreatingInteractions();
    }

    @ExportMethod()
    public getSearchRequestWithSameTags(): Promise<Array<SearchRequest>> {
        return this.verifyRepository.getSearchRequestWithSameTags();
    }

    @ExportMethod()
    public getSearchRequestWithoutOwner(): Promise<Array<SearchRequest>> {
        return this.verifyRepository.getSearchRequestWithoutOwner();
    }

    @ExportMethod()
    public getOfferInteractionsByOfferIdsAndOwners(
        offerIds: Array<number>,
        owners: Array<string>
    ): Promise<Array<OfferInteraction>> {
        return this.verifyRepository.getOfferInteractionsByOfferIdsAndOwners(offerIds, owners);
    }

    public deleteUser(publicKey: string): Promise<void> {
        return this.verifyRepository.deleteUser(publicKey);
    }
}
