import Account from '../models/Account';

export interface Auth {

    signUp(address: string): Promise<Account>

    signIn(id: string): Promise<Account>

}
