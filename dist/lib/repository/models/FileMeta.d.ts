import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';
export declare class FileMeta extends DeepCopy<FileMeta> {
    readonly id: number;
    readonly publicKey: string;
    name: string;
    mimeType: string;
    size: number;
    content?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static fromJson(json: JsonObject<FileMeta>): FileMeta;
    constructor(id?: number, publicKey?: string, name?: string, mimeType?: string, size?: number, content?: string);
    toJson(): object;
    protected deepCopyFromJson(): FileMeta;
    protected getClass(): ClassCreator<FileMeta>;
}
