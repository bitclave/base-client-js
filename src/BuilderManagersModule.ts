import { InternalManagerModule } from './InternalManagerModule';
import { ManagersModule } from './ManagersModule';
import { AssistantNodeFactory } from './repository/assistant/AssistantNodeFactory';
import { NonceSource } from './repository/assistant/NonceSource';
import { RepositoryStrategyType } from './repository/RepositoryStrategyType';
import { HttpTransportImpl } from './repository/source/http/HttpTransportImpl';
import { RepositoryStrategyInterceptor } from './repository/source/http/RepositoryStrategyInterceptor';
import { BasicLogger, Logger } from './utils/BasicLogger';
import { KeyPairFactory } from './utils/keypair/KeyPairFactory';
import { KeyPairHelper } from './utils/keypair/KeyPairHelper';
import { MessageDecrypt } from './utils/keypair/MessageDecrypt';
import { MessageEncrypt } from './utils/keypair/MessageEncrypt';
import { MessageSigner } from './utils/keypair/MessageSigner';

export class BuilderManagersModule {

    private _keyPairHelper: KeyPairHelper;
    private _messageSigner: MessageSigner;
    private _encryptMessage: MessageEncrypt;
    private _decryptMessage: MessageDecrypt;
    private _nonceSource: NonceSource;
    private _logger: Logger = new BasicLogger();
    private _strategy: RepositoryStrategyType = RepositoryStrategyType.Postgres;

    public constructor(public readonly nodeEndPoint: string, public readonly siteOrigin: string) {
    }

    public setKeyPairHelper(keyPair: KeyPairHelper): this {
        this._keyPairHelper = keyPair;
        return this;
    }

    public setStrategyType(strategy: RepositoryStrategyType): this {
        this._strategy = strategy;
        return this;
    }

    public setLoggerService(logger: Logger): this {
        this._logger = logger;
        return this;
    }

    public setMessageSigner(messageSigner: MessageSigner): this {
        this._messageSigner = messageSigner;
        return this;
    }

    public setMessageEncrypt(messageEncrypt: MessageEncrypt): this {
        this._encryptMessage = messageEncrypt;
        return this;
    }

    public setMessageDecrypt(messageDecrypt: MessageDecrypt): this {
        this._decryptMessage = messageDecrypt;
        return this;
    }

    public setNonceSource(nonceSource: NonceSource): this {
        this._nonceSource = nonceSource;
        return this;
    }

    public get keyPairHelper(): KeyPairHelper {
        return this._keyPairHelper;
    }

    public get messageSigner(): MessageSigner {
        return this._messageSigner;
    }

    public get encryptMessage(): MessageEncrypt {
        return this._encryptMessage;
    }

    public get decryptMessage(): MessageDecrypt {
        return this._decryptMessage;
    }

    public get nonceSource(): NonceSource {
        return this._nonceSource;
    }

    public get logger(): Logger {
        return this._logger;
    }

    public get strategy(): RepositoryStrategyType {
        return this._strategy;
    }

    public build(): ManagersModule {
        const assistantHttpTransport = new HttpTransportImpl(this.nodeEndPoint)
            .addInterceptor(new RepositoryStrategyInterceptor(this._strategy));

        const assistant = AssistantNodeFactory.defaultNodeAssistant(assistantHttpTransport);

        const localKeyPair = KeyPairFactory.createDefaultKeyPair(assistant, assistant, this.siteOrigin);

        if (!this._keyPairHelper) {
            this._keyPairHelper = localKeyPair;
        }

        if (!this._messageSigner) {
            this._messageSigner = localKeyPair;
        }

        if (!this._encryptMessage) {
            this._encryptMessage = localKeyPair;
        }

        if (!this._decryptMessage) {
            this._decryptMessage = localKeyPair;
        }

        if (!this._nonceSource) {
            this._nonceSource = assistant;
        }

        return new InternalManagerModule(this);
    }
}
