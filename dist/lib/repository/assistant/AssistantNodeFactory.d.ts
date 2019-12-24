import { HttpTransport } from '../source/http/HttpTransport';
import { AssistantNodeRepository } from './AssistantNodeRepository';
export declare class AssistantNodeFactory {
    static defaultNodeAssistant(httpTransport: HttpTransport): AssistantNodeRepository;
}
