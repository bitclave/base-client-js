import Account from '../repository/models/Account';
import { OfferSearch } from '../repository/models/OfferSearch';
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
}
