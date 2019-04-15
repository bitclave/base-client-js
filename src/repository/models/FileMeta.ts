import { DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';

export class FileMeta extends DeepCopy<FileMeta> {

    public readonly id: number;
    public readonly publicKey: string;
    public name: string;
    public mimeType: string;
    public size: number;
    public content?: string; // Base64
    public readonly createdAt: Date = new Date();
    public readonly updatedAt: Date = new Date();

    public static fromJson(json: JsonObject<FileMeta>): FileMeta {
        json.createdAt = new Date((json.createdAt as string) || new Date().getTime());
        json.updatedAt = new Date((json.updatedAt as string) || new Date().getTime());

        return Object.assign(new FileMeta(), json);
    }

    constructor(
        id: number = 0,
        publicKey: string = '0x0',
        name: string = '',
        mimeType: string = '',
        size: number = 0,
        content?: string
    ) {
        super();
        this.id = id || 0;
        this.publicKey = publicKey || '0x0';
        this.name = name || '';
        this.mimeType = mimeType || '';
        this.size = size || 0;
        this.content = content;
    }

    public toJson(): object {
        const json = JSON.parse(JSON.stringify(this));
        json.createdAt = this.createdAt.toJSON();
        json.updatedAt = this.updatedAt.toJSON();

        return json;
    }

    protected deepCopyFromJson(): FileMeta {
        return FileMeta.fromJson(this.toJson() as JsonObject<FileMeta>);
    }
}
