import Auth from './repository/auth/Auth';
import Wallet from './repository/wallet/Wallet';
import Profile from './repository/profile/Profile';
export default class Base {
    auth: Auth;
    wallet: Wallet;
    profile: Profile;
}
