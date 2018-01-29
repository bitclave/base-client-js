import Auth from './repository/auth/Auth';
import Wallet from './repository/wallet/Wallet';
import Profile from './repository/profile/Profile';

export default class Base {

    auth: Auth = new Auth();
    wallet: Wallet = new Wallet();
    profile: Profile = new Profile();

}
