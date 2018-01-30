import AccountModel from 'AccountModel';

export default class Profile {

    data: Map<string, string>;

    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;

    readonly account: AccountModel;

}
