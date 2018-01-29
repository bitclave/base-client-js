export default class Profile {
    getProfile(): Promise<Map<string, string>>;
    updateProfile(): Promise<boolean>;
}
