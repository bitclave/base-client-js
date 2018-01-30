import Account from '../models/Account';

export interface Auth {

    signUp(address: string): Promise<Account>

    signIn(): Promise<Account>

}
