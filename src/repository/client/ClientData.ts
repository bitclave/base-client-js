import Profile from '../models/Profile';

export interface ClientProfile {

    getProfile(): Promise<Map<string, string>>;

    updateProfile(): Promise<Map<string, string>>;

}
