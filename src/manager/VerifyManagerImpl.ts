import { VerifyRepository } from '../repository/verify/VerifyRepository';
import { VerifyManager } from './VerifyManager';
import OfferSearch from '../repository/models/OfferSearch';
import Account from '../repository/models/Account';

export class VerifyManagerImpl implements VerifyManager {

    private verifyRepository: VerifyRepository;

    constructor(verifyRepository: VerifyRepository) {
        this.verifyRepository = verifyRepository;
    }

    public getOfferSearchesByIds(ids: number[]): Promise<OfferSearch[]> {
        return this.verifyRepository.getOfferSearchesByIds(ids);
    }
    public getAccountsByPublicKeys(publicKeys: string[]): Promise<Account[]> {
        return this.verifyRepository.getAccountsByPublicKeys(publicKeys);
    }
}
