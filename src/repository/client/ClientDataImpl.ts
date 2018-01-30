import {ClientProfile} from './ClientProfile';
import Profile from '../models/Profile';

export default class ClientProfileImpl implements ClientProfile {

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    getProfile(): Promise<Map<string, string>> {
        return this.transport.sendRequest()
    }

    updateProfile(): Promise<Map<string, string>> {
        return new Promise<Profile>((resolve, reject) => {

        });
    }

}