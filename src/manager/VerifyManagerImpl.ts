import Account from '../repository/models/Account';
import { OfferInteraction } from '../repository/models/OfferInteraction';
import { OfferSearch } from '../repository/models/OfferSearch';
import SearchRequest from '../repository/models/SearchRequest';
import { VerifyRepository } from '../repository/verify/VerifyRepository';
import { VerifyManager } from './VerifyManager';

export class VerifyManagerImpl implements VerifyManager {

    private verifyRepository: VerifyRepository;

    constructor(verifyRepository: VerifyRepository) {
        this.verifyRepository = verifyRepository;
    }

    public getOfferSearchesByIds(ids: Array<number>): Promise<Array<OfferSearch>> {
        return this.verifyRepository.getOfferSearchesByIds(ids);
    }

    public getAccountsByPublicKeys(publicKeys: Array<string>): Promise<Array<Account>> {
        return this.verifyRepository.getAccountsByPublicKeys(publicKeys);
    }

    public getAllAccounts(fromDate: Date): Promise<Array<Account>> {
        return this.verifyRepository.getAllAccounts(fromDate);
    }

    public getDanglingOfferSearches(type: number): Promise<Array<OfferSearch>> {
        return this.verifyRepository.getDanglingOfferSearches(type);
    }

    public getDanglingOfferInteractions(): Promise<Array<OfferInteraction>> {
        return this.verifyRepository.getDanglingOfferInteractions();
    }

    public fixDanglingOfferSearchesByCreatingInteractions(): Promise<Array<OfferInteraction>> {
        return this.verifyRepository.fixDanglingOfferSearchesByCreatingInteractions();
    }

    public getSearchRequestWithSameTags(): Promise<Array<SearchRequest>> {
        return this.verifyRepository.getSearchRequestWithSameTags();
    }

    public getSearchRequestWithoutOwner(): Promise<Array<SearchRequest>> {
        return this.verifyRepository.getSearchRequestWithoutOwner();
    }

    public getOfferInteractionsByOfferIdsAndOwners(offerIds: Array<number>, 
                                                   owners: Array<string>): Promise<Array<OfferInteraction>> {
        return this.verifyRepository.getOfferInteractionsByOfferIdsAndOwners(offerIds, owners);
    }

    public deleteUser(publicKey: string): Promise<void> {
        return this.verifyRepository.deleteUser(publicKey);
    }
}
