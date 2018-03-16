import { HttpInterceptor } from './HttpInterceptor';
import { MessageSigner } from '../../../utils/keypair/MessageSigner';
export default class SignInterceptor implements HttpInterceptor {
    private data;
    private path;
    private headers;
    private messageSigner;
    constructor(messageSigner: MessageSigner);
    onIntercept(path: string, headers: Map<string, string>, data: any): Promise<void>;
    getData(): any;
    getPath(): string;
    getHeaders(): Map<string, string>;
}
